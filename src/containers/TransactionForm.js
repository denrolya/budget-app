import {
  ErrorMessage, Field, Form, Formik,
} from 'formik';
import get from 'lodash/get';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import { connect } from 'react-redux';
import {
  Button, ButtonGroup, Col, FormGroup, Input, Label,
} from 'reactstrap';

import AccountTypeahead from 'src/components/AccountTypeahead';
import CategoryTypeahead from 'src/components/CategoryTypeahead';
import ModalForm from 'src/components/forms/ModalForm';
import LoadingButton from 'src/components/LoadingButton';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import {
  DEBT_TRANSACTION_CATEGORY_NAME,
  EXPENSE_TYPE,
  INCOME_TYPE,
  INITIAL_FORM_DATA,
  TRANSACTION_TYPES,
  VALIDATION_SCHEMA,
} from 'src/constants/transactions';
import { useActiveAccountsWithDefaultOrder } from 'src/contexts/AccountsContext';
import { useCategories, useCompensationIncomeCategory, useDebtIncomeCategory } from 'src/contexts/CategoriesContext';
import { isActionLoading } from 'src/utils/common';

const TransactionForm = ({
  title,
  model,
  isSaving,
  isOpen,
  onSubmit,
  toggleModal,
}) => {
  const accountOptions = useActiveAccountsWithDefaultOrder();
  const categoryOptions = useCategories();
  const debtIncomeCategory = useDebtIncomeCategory();
  const compensationIncomeCategory = useCompensationIncomeCategory();
  const isEditMode = !!model.id;
  const [form, setForm] = useState({
    initialValues: INITIAL_FORM_DATA,
    validationSchema: VALIDATION_SCHEMA,
  });

  const formatCategory = (category) => {
    let result;
    if (category?.id) {
      result = category.id;
    } else if (isString(category)) {
      result = categoryOptions.find(({ name, type }) => type === model.type && name === category)?.id || '';
    } else {
      result = INITIAL_FORM_DATA.category;
    }

    return result;
  };

  useEffect(() => {
    setForm({
      ...form,
      initialValues: {
        ...INITIAL_FORM_DATA,
        ...model,
        category: formatCategory(model.category),
        account: model.account?.id ? model.account.id : model.account,
        executedAt: moment(model.executedAt).format(MOMENT_DATETIME_FORMAT),
        compensations: model?.compensations?.map((c) => ({
          ...c,
          executedAt: moment(c.executedAt).format(MOMENT_DATETIME_FORMAT),
          category: formatCategory(c.category),
          account: c.account?.id ? c.account.id : c.account,
        })),
      },
    });
  }, [model]);

  const handleSubmit = async ({ closeModal, ...values }, { resetForm }) => {
    await onSubmit(values);

    if (!isEditMode) {
      resetForm();
    }

    if (closeModal) {
      toggleModal();
    }
  };

  return (
    <ModalForm title={title} isOpen={isOpen} toggleModal={toggleModal}>
      <Formik
        enableReinitialize
        initialValues={form.initialValues}
        validationSchema={form.validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          touched,
          errors,
          handleBlur,
          setFieldValue,
        }) => {
          const {
            type,
            category,
            amount,
            account,
            note,
            executedAt,
            compensations,
            isDraft,
          } = values;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            if (category) {
              const selectedCategoryName = categoryOptions.find(({ id }) => id === category).name;
              const categoryForNewType = categoryOptions.find((c) => c.type === type && c.name === selectedCategoryName);
              setFieldValue('category', categoryForNewType ? categoryForNewType.id : '');
            }
          }, [type]);
          const newCompensation = () => ({
            executedAt,
            account: '',
            amount: 0,
            category: (category === DEBT_TRANSACTION_CATEGORY_NAME ? debtIncomeCategory : compensationIncomeCategory)?.id,
            type: INCOME_TYPE,
            note: note ? `[Compensation]: ${note}` : '',
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
                <CategoryTypeahead
                  id="category"
                  className="form-control-typeahead"
                  name="category"
                  placeholder="Select category..."
                  labelKey="name"
                  multple={false}
                  autoFocus={!isEditMode}
                  inputProps={{ id: 'category' }}
                  isInvalid={touched.category && !!errors.category}
                  selected={category ? categoryOptions.filter(({ id }) => id === category) : []}
                  onBlur={handleBlur}
                  onChange={([selected]) => setFieldValue('category', selected ? selected.id : '')}
                  options={categoryOptions.filter((c) => c.type === type)}
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
                    <Label for="account-typeahead-account">Account*</Label>
                    <AccountTypeahead
                      id="account"
                      className="form-control-typeahead"
                      name="account"
                      placeholder="Select account..."
                      labelKey="name"
                      inputProps={{ id: 'account' }}
                      isInvalid={touched.account && !!errors.account}
                      selected={account}
                      onBlur={handleBlur}
                      onChange={([selected]) => setFieldValue('account', selected ? selected.id : '')}
                    />
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

                  {compensations && compensations.map((compensation, key) => {
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
                                <Label for="account-typeahead-account">Account*</Label>
                                <AccountTypeahead
                                  className="form-control-typeahead"
                                  placeholder="Select account..."
                                  labelKey="name"
                                  inputProps={{ id: 'account' }}
                                  isInvalid={!!get(touched, accountKey) && !!get(errors, accountKey)}
                                  id={accountKey}
                                  name={accountKey}
                                  selected={compensations[key].account}
                                  onBlur={handleBlur}
                                  onChange={([selected]) => setFieldValue(accountKey, selected ? selected.id : '')}
                                />
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
                      <LoadingButton type="submit" isLoading={isSaving} onClick={() => setFieldValue('closeModal', false)} />
                    )}
                    <LoadingButton
                      type="submit"
                      color="warning"
                      label="& Close"
                      className="mr-1"
                      isLoading={isSaving}
                      onClick={() => setFieldValue('closeModal', true)}
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
  model: INITIAL_FORM_DATA,
  title: 'New transaction',
};

TransactionForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object,
  title: PropTypes.string,
};

const mapStateToProps = ({ ui }) => ({
  isSaving: isActionLoading(ui.TRANSACTION_REGISTER) || isActionLoading(ui.TRANSACTION_EDIT),
});

export default connect(mapStateToProps)(TransactionForm);
