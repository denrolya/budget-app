import { ErrorMessage, Field, Formik } from 'formik';
import get from 'lodash/get';
import moment from 'moment-timezone';
import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  Button, ButtonGroup, Col, Form, FormGroup, Input, Label,
} from 'reactstrap';

import ModalForm from 'src/components/forms/ModalForm';
import LoadingButton from 'src/components/LoadingButton';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import {
  COMPENSATION_TRANSACTION_CATEGORY_NAME,
  DEBT_TRANSACTION_CATEGORY_NAME,
  EXPENSE_TYPE,
  INCOME_TYPE, TRANSACTION_TYPES,
} from 'src/constants/transactions';
import { isActionLoading } from 'src/services/common';
import { fetchCategories } from 'src/store/actions/category';
import * as Yup from 'yup';

const TransactionForm = ({
  isSaving, model, title, isOpen, onSubmit, toggleModal, accountOptions,
}) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    initialValues: model,
    validationSchema: Yup.object({
      type: Yup.string().oneOf([EXPENSE_TYPE, INCOME_TYPE]).required('Required field'),
      account: Yup.number().required('Required field'),
      amount: Yup.number().min(0, 'Invalid amount entered').required('Required field'),
      category: Yup.string().required('Required field'),
      executedAt: Yup.string().required('Required field'),
      note: Yup.string(),
      isDraft: Yup.bool(),
      compensations: Yup.array().of(
        Yup.object({
          account: Yup.string().required('Required field'),
          amount: Yup.number().min(0, 'Invalid amount entered').required('Required field'),
          executedAt: Yup.string().required('Required field'),
        }),
      ),
    }),
  });

  const isEditMode = !!model.id;

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res));

    if (isEditMode) {
      setForm({
        ...form,
        initialValues: {
          ...model,
          category: model.category?.name ? model.category.name : model.category,
          account: model.account?.id ? model.account.id : model.account,
          executedAt: moment(model.executedAt).format(MOMENT_DATETIME_FORMAT),
          compensations: model?.compensations?.map((c) => ({
            ...c,
            executedAt: moment(c.executedAt).format(MOMENT_DATETIME_FORMAT),
          })),
        },
      });
    }
  }, []);

  const handleSubmit = async (model, addAnother = true) => {
    await onSubmit(model.values);

    if (!isEditMode) {
      model.handleReset();
    }

    if (!addAnother && toggleModal) {
      toggleModal();
    }
  };

  return (
    <ModalForm title={title} isOpen={isOpen} toggleModal={toggleModal}>
      <Formik
        enableReinitialize
        initialValues={form.initialValues}
        validationSchema={form.validationSchema}
      >
        {(model) => {
          const {
            values, touched, errors, handleBlur, setFieldValue,
          } = model;
          const {
            type, category, amount, account, note, executedAt, compensations, isDraft,
          } = values;
          const newCompensation = () => ({
            executedAt,
            account: '',
            amount: 0,
            category: category === DEBT_TRANSACTION_CATEGORY_NAME
              ? DEBT_TRANSACTION_CATEGORY_NAME
              : COMPENSATION_TRANSACTION_CATEGORY_NAME,
            type: INCOME_TYPE,
            note: `[Compensation]: ${note}`,
          });

          return (
            <Form>
              <FormGroup>
                <ButtonGroup className="d-flex">
                  {TRANSACTION_TYPES.map((t) => (
                    <Button
                      className="btn-simple flex-grow-1"
                      key={t}
                      disabled={isEditMode}
                      onClick={() => setFieldValue('type', t)}
                      active={type === t}
                    >
                      <span className="d-sm-block d-md-block d-lg-block d-xl-block text-capitalize">{t}</span>
                    </Button>
                  ))}
                </ButtonGroup>
              </FormGroup>

              {form.initialValues.isDraft && <h3 className="text-warning">Draft</h3>}

              <FormGroup>
                <Typeahead
                  allowNew
                  id="category"
                  className="form-control-typeahead"
                  name="category"
                  placeholder="Select category..."
                  labelKey="name"
                  autoFocus={!isEditMode}
                  multiple={false}
                  inputProps={{ id: 'category' }}
                  isInvalid={touched.category && !!errors.category}
                  selected={category ? [category] : []}
                  onBlur={handleBlur}
                  onChange={([selected]) => setFieldValue('category', selected ? selected.name : '')}
                  options={categories.filter((c) => c.type === type)}
                />
                <ErrorMessage component="div" name="category" className="invalid-feedback" />
              </FormGroup>

              <FormGroup row className="mb-md-0">
                <Col md={6}>
                  <FormGroup>
                    <Label for="amount">Amount*</Label>
                    <Field
                      id="amount"
                      name="amount"
                      type="number"
                      step="any"
                      placeholder="Enter the amount"
                      as={Input}
                      min={0}
                      invalid={touched.amount && !!errors.amount}
                      value={amount}
                    />
                    <ErrorMessage component="div" name="amount" className="invalid-feedback" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="accountSelect">Account*</Label>
                    <Input
                      type="select"
                      name="account"
                      id="accountSelect"
                      value={account}
                      onChange={({ target }) => setFieldValue('account', target.value)}
                    >
                      <option value="">------------</option>
                      {accountOptions.map(({ id, name, archivedAt }) => (
                        <option key={`account-option-${id}`} value={parseInt(id, 10)}>
                          {name}
                          {' '}
                          {archivedAt ? `(Archived ${moment(archivedAt).calendar()})` : ''}
                        </option>
                      ))}
                    </Input>
                    <ErrorMessage component="div" name="account" className="invalid-feedback" />
                  </FormGroup>
                </Col>
              </FormGroup>

              <FormGroup>
                <Label for="executedAt">Executed At*</Label>
                <Field
                  type="datetime-local"
                  name="executedAt"
                  id="executedAt"
                  as={Input}
                  value={executedAt}
                  invalid={touched.executedAt && !!errors.executedAt}
                />
                <ErrorMessage component="div" name="executedAt" className="invalid-feedback" />
              </FormGroup>

              <FormGroup>
                <Label for="note">Note</Label>
                <Field
                  type="textarea"
                  name="note"
                  id="note"
                  className="form-control-alternative"
                  as={Input}
                  invalid={touched.note && !!errors.note}
                  value={note}
                />
                <ErrorMessage component="div" name="note" className="invalid-feedback" />
              </FormGroup>

              {type === EXPENSE_TYPE && (
                <>
                  <FormGroup row>
                    <Col>
                      <h4 className="text-black-50">Have it compensated?</h4>
                    </Col>
                    <Col className="text-right">
                      <Button
                        color="success"
                        size="sm"
                        className="btn-icon btn-round"
                        onClick={() => {
                          setFieldValue('compensations', [...compensations, newCompensation()]);
                        }}
                      >
                        <i className="tim-icons icon-simple-add" aria-hidden />
                      </Button>
                    </Col>
                  </FormGroup>

                  <hr />

                  {compensations
                         && compensations.map((compensation, key) => {
                           const amountKey = `compensations.${key}.amount`;
                           const accountKey = `compensations.${key}.account`;
                           const executedAtKey = `compensations.${key}.executedAt`;
                           return (
                             <FormGroup row className="mb-md-0" key={compensation.id}>
                               <Col xs={12} md={1} className="text-sm-right align-center">
                                 <Button
                                   color="warning"
                                   size="sm"
                                   className="btn-icon btn-round"
                                   onClick={() => {
                                     compensations.splice(key, 1);
                                     setFieldValue('compensations', compensations);
                                   }}
                                 >
                                   <i className="tim-icons icon-simple-remove" aria-hidden />
                                 </Button>
                               </Col>

                               <Col>
                                 <FormGroup row>
                                   <Col xs={12} md={6}>
                                     <FormGroup>
                                       <Label for={amountKey}>Amount*</Label>
                                       <Field
                                         as={Input}
                                         id={amountKey}
                                         name={amountKey}
                                         type="number"
                                         min={0}
                                         step="any"
                                         placeholder="Enter the amount"
                                         invalid={!!get(touched, amountKey) && !!get(errors, amountKey)}
                                         value={compensations[key].amount}
                                       />
                                       <ErrorMessage component="div" name={amountKey} className="invalid-feedback" />
                                     </FormGroup>
                                   </Col>
                                   <Col xs={12} md={6}>
                                     <FormGroup>
                                       <Label for="accountSelect">Account*</Label>
                                       <Input
                                         type="select"
                                         name={accountKey}
                                         id={accountKey}
                                         value={compensations[key].account}
                                         onChange={({ target }) => setFieldValue(accountKey, target.value)}
                                       >
                                         <option value="">-----------</option>
                                         {accountOptions.map(({ id, name, archivedAt }) => (
                                           <option key={`account-option-${id}`} value={parseInt(id, 10)}>
                                             {name}
                                             {' '}
                                             {archivedAt ? `(Archived ${moment(archivedAt).calendar()})` : ''}
                                           </option>
                                         ))}
                                       </Input>
                                       <ErrorMessage component="div" className="invalid-feedback" name={accountKey} />
                                     </FormGroup>
                                   </Col>
                                   <Col xs={12} md={12}>
                                     <FormGroup>
                                       <Label for={executedAtKey}>Executed at*</Label>
                                       <Field
                                         type="datetime-local"
                                         name={executedAtKey}
                                         as={Input}
                                         id={executedAtKey}
                                         value={compensations[key].executedAt}
                                         invalid={!!get(touched, executedAtKey) && !!get(errors, executedAtKey)}
                                       />
                                       <ErrorMessage component="div" className="invalid-feedback" name={executedAtKey} />
                                     </FormGroup>
                                   </Col>
                                 </FormGroup>
                               </Col>
                             </FormGroup>
                           );
                         })}
                </>
              )}

              <FormGroup row>
                {form.initialValues.isDraft && (
                  <Col className="text-left">
                    <Button
                      color="info"
                      className="btn-simple"
                      active={isDraft}
                      onClick={() => setFieldValue('isDraft', !isDraft)}
                    >
                      Draft
                    </Button>
                  </Col>
                )}
                <Col className="text-right">
                  <ButtonGroup>
                    {!form.initialValues.isDraft && (
                      <LoadingButton type="button" isLoading={isSaving} onClick={() => handleSubmit(model)} />
                    )}
                    <LoadingButton
                      type="button"
                      color="warning"
                      label="& Close"
                      className="mr-1"
                      isLoading={isSaving}
                      onClick={() => handleSubmit(model, false)}
                    />
                  </ButtonGroup>
                </Col>
              </FormGroup>
            </Form>
          );
        }}
      </Formik>
    </ModalForm>
  );
};

TransactionForm.defaultProps = {
  accountOptions: [],
  model: {
    type: EXPENSE_TYPE,
    account: '',
    amount: 0,
    category: '',
    executedAt: moment().format(MOMENT_DATETIME_FORMAT),
    note: '',
    compensations: [],
    isDraft: false,
  },
  title: 'New transaction',
};

TransactionForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  accountOptions: PropTypes.array,
  model: PropTypes.object,
  title: PropTypes.string,
};

const mapStateToProps = ({ ui, account }) => ({
  isSaving: isActionLoading(ui.TRANSACTION_REGISTER) || isActionLoading(ui.TRANSACTION_EDIT),
  accountOptions: account.filter(({ archivedAt }) => !archivedAt),
});

export default connect(mapStateToProps)(TransactionForm);
