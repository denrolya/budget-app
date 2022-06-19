import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  ErrorMessage, Field, Formik, Form,
} from 'formik';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {
  Col, FormGroup, Input, Label,
} from 'reactstrap';
import { useAccounts, useDefaultCashAccount } from 'src/contexts/AccountsContext';
import { useUnknownExpenseCategory } from 'src/contexts/CategoriesContext';
import { isActionLoading } from 'src/utils/common';
import { toggleDraftExpenseModal } from 'src/store/actions/ui';

import { registerTransaction } from 'src/store/actions/transaction';
import LoadingButton from 'src/components/LoadingButton';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { INITIAL_FORM_DATA, VALIDATION_SCHEMA } from 'src/constants/transactions';
import ModalForm from 'src/components/forms/ModalForm';

const DraftCashExpenseForm = ({
  isSaving,
  isOpen,
  onSubmit,
  toggleModal,
}) => {
  const accountOptions = useAccounts();
  const defaultCashAccount = useDefaultCashAccount()?.id;
  const unknownExpenseCategory = useUnknownExpenseCategory()?.id;
  const [form, setForm] = useState({
    initialValues: {
      ...INITIAL_FORM_DATA,
      account: defaultCashAccount,
      category: unknownExpenseCategory,
      isDraft: true,
    },
    validationSchema: VALIDATION_SCHEMA,
  });

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
        {({
          values: { amount, account, note },
          touched,
          errors,
          setFieldValue,
        }) => (
          <Form role="form">
            {form.initialValues.isDraft && <h3 className="text-warning">Draft</h3>}

            <FormGroup row className="mb-md-0">
              <Col md={6}>
                <FormGroup>
                  <Label for="amount">Amount*</Label>
                  <Field
                    autoFocus
                    min={0}
                    id="amount"
                    name="amount"
                    type="number"
                    step="any"
                    placeholder="Enter the amount"
                    as={Input}
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
        )}
      </Formik>
    </ModalForm>
  );
};

DraftCashExpenseForm.defaultProps = {};

DraftCashExpenseForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = ({ ui }) => ({
  isOpen: ui.isDraftExpenseModalOpened,
  isSaving: isActionLoading(ui.TRANSACTION_REGISTER),
});

export default connect(mapStateToProps, {
  onSubmit: registerTransaction,
  toggleModal: toggleDraftExpenseModal,
})(DraftCashExpenseForm);
