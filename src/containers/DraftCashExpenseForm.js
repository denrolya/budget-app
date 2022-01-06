import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  ErrorMessage, Field, Formik, Form,
} from 'formik';
import find from 'lodash/find';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {
  Col, FormGroup, Input, Label,
} from 'reactstrap';
import { isActionLoading } from 'src/services/common';
import { toggleDraftExpenseModal } from 'src/store/actions/ui';
import * as Yup from 'yup';

import { registerTransaction } from 'src/store/actions/transaction';
import LoadingButton from 'src/components/LoadingButton';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import ModalForm from 'src/components/forms/ModalForm';
import { ACCOUNT_TYPE_CASH } from 'src/constants/account';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const DraftCashExpenseForm = ({
  isSaving, isOpen, onSubmit, toggleModal, accountOptions,
}) => {
  const { code } = useBaseCurrency();
  const [form, setForm] = useState({
    initialValues: {
      type: EXPENSE_TYPE,
      amount: '',
      account: '',
      category: 'Unknown',
      executedAt: moment().format(MOMENT_DATETIME_FORMAT),
      note: '',
      compensations: [],
      isDraft: true,
    },
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

  useEffect(() => {
    setForm({
      ...form,
      initialValues: {
        ...form.initialValues,
        account: find(accountOptions, ({ currency, type }) => type === ACCOUNT_TYPE_CASH && currency === code)?.id,
      },
    });
  }, []);

  useEffect(() => {
    setForm({
      ...form,
      initialValues: {
        ...form.initialValues,
        executedAt: moment().format(MOMENT_DATETIME_FORMAT),
      },
    });
  }, [isOpen]);

  const handleSubmit = async (values) => {
    await onSubmit(values.type, values);

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
          const {
            values, touched, errors, setFieldValue,
          } = model;
          const { amount, account, note } = values;

          return (
            <Form role="form">
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
                    <Label for="accountSelect">
                      Account*
                    </Label>
                    <Input
                      type="select"
                      name="account"
                      id="accountSelect"
                      value={account}
                      onChange={({ target }) => setFieldValue('account', target.value)}
                    >
                      <option value="">----------------</option>
                      {accountOptions.map(({ id, name, archivedAt }) => (
                        <option key={`account-option-${id}`} value={id}>
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
                isLoading={isSaving}
              />
            </Form>
          );
        }}
      </Formik>
    </ModalForm>
  );
};

DraftCashExpenseForm.defaultProps = {
  accountOptions: [],
};

DraftCashExpenseForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  accountOptions: PropTypes.array,
};

const mapStateToProps = ({ ui, account }) => ({
  isOpen: ui.isDraftExpenseModalOpened,
  isSaving: isActionLoading(ui.TRANSACTION_REGISTER),
  accountOptions: account.filter(({ archivedAt }) => !archivedAt),
});

export default connect(mapStateToProps, {
  onSubmit: registerTransaction,
  toggleModal: toggleDraftExpenseModal,
})(DraftCashExpenseForm);
