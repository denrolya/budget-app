import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Formik } from 'formik';
import get from 'lodash/get';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  Button, ButtonGroup, Col, Form, FormGroup, Input, Label,
} from 'reactstrap';
import * as Yup from 'yup';

import LoadingButton from 'src/components/LoadingButton';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import {
  COMPENSATION_TRANSACTION_CATEGORY_NAME,
  EXPENSE_TYPE,
  INCOME_TYPE,
  TRANSACTION_TYPES,
  DEBT_TRANSACTION_CATEGORY_NAME,
} from 'src/constants/transactions';
import { fetchTypeaheadList as fetchAccounts } from 'src/store/actions/account';
import { fetchCategories } from 'src/store/actions/category';

const TransactionForm = ({
  isLoading, modelData, onSubmit, toggleModal,
}) => {
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    initialValues: modelData,
    validationSchema: Yup.object({
      type: Yup.string().oneOf([EXPENSE_TYPE, INCOME_TYPE]).required('Required field'),
      account: Yup.string().required('Required field'),
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

  const isEditMode = !!modelData.id;

  const fetchData = async () => {
    setCategories(await fetchCategories());

    const accounts = await fetchAccounts();
    setAccounts(
      accounts.map((a) => ({
        ...a,
        lastTransactionAt: moment(a.lastTransactionAt, MOMENT_DATETIME_FORMAT).unix(),
      })),
    );
  };

  useEffect(() => {
    fetchData();

    if (isEditMode) {
      setForm({
        ...form,
        initialValues: {
          ...modelData,
          executedAt: moment(modelData.executedAt).format(MOMENT_DATETIME_FORMAT),
          compensations: modelData?.compensations?.map((c) => ({
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

      setAccounts(
        accounts.map((a) => ({
          ...a,
          lastTransactionAt: a.id === model.values.account.id ? moment() : a.lastTransactionAt,
        })),
      );
    }

    if (!addAnother && toggleModal) {
      toggleModal();
    }
  };

  return (
    <Formik enableReinitialize initialValues={form.initialValues} validationSchema={form.validationSchema}>
      {(model) => {
        const {
          values, touched, errors, handleBlur, setFieldValue,
        } = model;
        const {
          type, category, amount, account, note, executedAt, compensations, isDraft,
        } = values;
        const newCompensation = () => ({
          account: '',
          amount: 0,
          category: {
            name:
              category.name === DEBT_TRANSACTION_CATEGORY_NAME
                ? DEBT_TRANSACTION_CATEGORY_NAME
                : COMPENSATION_TRANSACTION_CATEGORY_NAME,
          },
          type: INCOME_TYPE,
          executedAt,
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
                onChange={(s) => setFieldValue('category', s.length ? s[0] : '')}
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
                  <Label for="account">Account*</Label>
                  <Typeahead
                    allowNew
                    id="account"
                    className="form-control-typeahead"
                    name="account"
                    placeholder="Select account..."
                    labelKey="name"
                    multiple={false}
                    inputProps={{ id: 'account' }}
                    isInvalid={touched.account && !!errors.account}
                    selected={account ? [account] : []}
                    onBlur={handleBlur}
                    onChange={(s) => setFieldValue('account', s.length ? s[0] : '')}
                    options={accounts.sort((a, b) => b.lastTransactionAt - a.lastTransactionAt)}
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
                                <Label for={accountKey}>Account*</Label>
                                <Typeahead
                                  allowNew
                                  multiple={false}
                                  name={accountKey}
                                  id={accountKey}
                                  className="form-control-typeahead"
                                  inputProps={{ id: accountKey }}
                                  placeholder="Select account..."
                                  invalid={!!get(touched, accountKey) && !!get(errors, accountKey)}
                                  labelKey="name"
                                  selected={compensations[key].account ? [compensations[key].account] : []}
                                  onBlur={handleBlur}
                                  onChange={(s) => setFieldValue(accountKey, s.length ? s[0] : '')}
                                  options={accounts}
                                />
                                <ErrorMessage component="div" name={accountKey} className="invalid-feedback" />
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
                    <LoadingButton type="button" isLoading={isLoading} onClick={() => handleSubmit(model)} />
                  )}
                  <LoadingButton
                    type="button"
                    color="warning"
                    label="& Close"
                    className="mr-1"
                    isLoading={isLoading}
                    onClick={() => handleSubmit(model, false)}
                  />
                </ButtonGroup>
              </Col>
            </FormGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

TransactionForm.defaultProps = {
  modelData: {
    type: EXPENSE_TYPE,
    account: '',
    amount: 0,
    category: '',
    executedAt: moment().format(MOMENT_DATETIME_FORMAT),
    note: '',
    compensations: [],
    isDraft: false,
  },
};

TransactionForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  modelData: PropTypes.object,
  toggleModal: PropTypes.func,
};

export default TransactionForm;