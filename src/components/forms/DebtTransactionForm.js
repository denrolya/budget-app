import { ErrorMessage, Field, Formik } from 'formik';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import {
  Button, ButtonGroup, Col, Form, FormGroup, Input, Label,
} from 'reactstrap';
import * as Yup from 'yup';

import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import {
  DEBT_TRANSACTION_CATEGORY_NAME, EXPENSE_TYPE, INCOME_TYPE, TRANSACTION_TYPES,
} from 'src/constants/transactions';
import { fetchTypeaheadList as fetchAccounts } from 'src/store/actions/account';
import { fetchCategories } from 'src/store/actions/category';
import { registerDebtTransaction } from 'src/store/actions/debt';
import debtType from 'src/types/debt';
import transactionType from 'src/types/transaction';

const DebtTransactionForm = ({
  modelData, debt, registerDebtTransaction, toggleModal,
}) => {
  // Initialize state
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [closeDebt, setCloseDebt] = useState(false);

  // Initialize container
  useEffect(() => {
    fetchCategories().then((categories) => setCategories(categories));
    fetchAccounts().then((accounts) => setAccounts(accounts));
  }, []);

  const isEditMode = !!modelData;
  const toggleCloseDebt = () => setCloseDebt(!closeDebt);
  const initialData = isEditMode
    ? {
      ...modelData,
      createdAt: moment(modelData.createdAt).format(MOMENT_DATETIME_FORMAT),
    }
    : {
      type: EXPENSE_TYPE,
      account: '',
      amount: 0,
      category: DEBT_TRANSACTION_CATEGORY_NAME,
      createdAt: moment().format(MOMENT_DATETIME_FORMAT),
      note: '',
      compensations: [],
    };
  const validationSchema = Yup.object({
    type: Yup.string().oneOf([EXPENSE_TYPE, INCOME_TYPE]).required('Required field'),
    account: Yup.number().required('Required field'),
    amount: Yup.number().min(0, 'Invalid amount entered').required('Required field'),
    category: Yup.string().required('Required field'),
    createdAt: Yup.string().required('Required field'),
    note: Yup.string(),
  });

  const onSubmit = async (values, { resetForm }) => {
    await registerDebtTransaction(debt.id, values.type, values, closeDebt);

    resetForm();

    if (toggleModal) {
      toggleModal();
    }
  };

  return (
    <Formik enableReinitialize initialValues={initialData} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(model) => {
        const {
          values, touched, errors, handleSubmit, handleBlur, setFieldValue,
        } = model;
        const {
          type, category, amount, account, note, createdAt,
        } = values;

        return (
          <Form onSubmit={handleSubmit}>
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
                    <span className="d-sm-block d-md-block d-lg-block d-xl-block text-capitalize">
                      {t}
                      {' '}
                    </span>
                  </Button>
                ))}
              </ButtonGroup>
            </FormGroup>

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
                    as={Input}
                    id="amount"
                    name="amount"
                    type="number"
                    min={0}
                    step="any"
                    placeholder="Enter the amount"
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
                    {accounts.map(({ id, name, archivedAt }) => (
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
              <Label for="createdAt">Created At*</Label>
              <Field
                as={Input}
                type="datetime-local"
                name="createdAt"
                id="createdAt"
                value={createdAt}
                invalid={touched.createdAt && !!errors.createdAt}
              />
              <ErrorMessage component="div" name="createdAt" className="invalid-feedback" />
            </FormGroup>

            <FormGroup>
              <Label for="note">Note</Label>
              <Field
                as={Input}
                type="textarea"
                name="note"
                id="note"
                className="form-control-alternative"
                invalid={touched.note && !!errors.note}
                value={note}
              />
              <ErrorMessage component="div" name="note" className="invalid-feedback" />
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input type="checkbox" checked={closeDebt} onChange={toggleCloseDebt} />
                <span className="form-check-sign" />
                {' '}
                Close debt
              </Label>
              <Button className="pull-right" color="primary" type="submit">
                Submit
              </Button>
            </FormGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

DebtTransactionForm.propTypes = {
  debt: debtType.isRequired,
  registerDebtTransaction: PropTypes.func.isRequired,
  modelData: transactionType,
  toggleModal: PropTypes.func,
};

export default connect(null, {
  registerDebtTransaction,
})(DebtTransactionForm);
