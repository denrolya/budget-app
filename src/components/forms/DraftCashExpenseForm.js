import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Formik } from 'formik';
import find from 'lodash/find';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Col, Form, FormGroup, Input, Label } from 'reactstrap';
import * as Yup from 'yup';

import LoadingButton from 'src/components/LoadingButton';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import { fetchTypeaheadList as fetchAccounts } from 'src/store/actions/account';
import ModalForm from 'src/components/forms/ModalForm';
import { ACCOUNT_TYPE_CASH } from 'src/constants/account';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const DraftCashExpenseForm = ({ isLoading, isOpen, onSubmit, toggleModal }) => {
  const { code } = useBaseCurrency();
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    initialValues: {
      type: EXPENSE_TYPE,
      amount: '',
      account: '',
      category: 'Unknown',
      executedAt: moment().format(MOMENT_DATETIME_FORMAT),
      note: '',
      compensations: [],
      isDraft: false,
    },
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

  const fetchData = async () => {
    const accounts = await fetchAccounts();
    setAccounts(
      accounts.map((a) => ({
        ...a,
        lastTransactionAt: moment(a.lastTransactionAt, MOMENT_DATETIME_FORMAT).unix(),
      })),
    );

    setForm({
      ...form,
      initialValues: {
        ...form.initialValues,
        account: find(accounts, ({ currency, type }) => type === ACCOUNT_TYPE_CASH && currency === code),
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    await onSubmit(values);

    if (toggleModal) {
      toggleModal();
    }
  };

  return (
    <ModalForm title="Draft expense" isOpen={isOpen} toggleModal={toggleModal}>
      <Formik
        enableReinitialize
        validateOnBlur
        validateOnMount
        validateOnChange
        initialValues={form.initialValues}
        validationSchema={form.validationSchema}
        onSubmit={handleSubmit}
      >
        {(model) => {
          const { values, touched, errors, handleBlur, setFieldValue } = model;
          const { amount, account, note } = values;

          return (
            <Form>
              {form.initialValues.isDraft && <h3 className="text-warning">Draft</h3>}

              <FormGroup row className="mb-md-0">
                <Col md={6}>
                  <FormGroup>
                    <Label for="amount">Amount*</Label>
                    <Field
                      autoFocus
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

              <LoadingButton
                block
                type="submit"
                color="primary"
                label="Submit"
                className="mr-1"
                isLoading={isLoading}
              />
            </Form>
          );
        }}
      </Formik>
    </ModalForm>
  );
};

DraftCashExpenseForm.defaultProps = {};

DraftCashExpenseForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  toggleModal: PropTypes.func,
};

export default DraftCashExpenseForm;
