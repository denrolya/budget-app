import { ErrorMessage, Field, Formik } from 'formik';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import { Col, Form, FormGroup, Input, Label } from 'reactstrap';
import * as Yup from 'yup';

import LoadingButton from 'src/components/LoadingButton';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { formatTransferToFormType } from 'src/services/transaction';
import { fetchTypeaheadList as fetchAccounts } from 'src/store/actions/account';
import { registerTransfer } from 'src/store/actions/transfer';
import transferType from 'src/types/transfer';

const TransferForm = ({ isLoading, registerTransfer, toggleModal }) => {
  const [accounts, setAccounts] = useState([]);

  // Initialize container
  useEffect(() => {
    fetchAccounts().then((data) => setAccounts(data));
  }, []);

  const initialData = {
    from: '',
    to: '',
    amount: 0,
    rate: 0,
    fee: 0,
    feeAccount: '',
    executedAt: moment().format(MOMENT_DATETIME_FORMAT),
    note: '',
  };
  const validationSchema = Yup.object({
    from: Yup.string().required('Required field'),
    to: Yup.string().required('Required field'),
    amount: Yup.number().required('Required field'),
    rate: Yup.number().moreThan(0, 'Invalid value').required('Required field'),
    fee: Yup.number(),
    feeAccount: Yup.string(),
    executedAt: Yup.string().required('Required field'),
    note: Yup.string(),
  });

  const submitTransfer = (values) => registerTransfer(formatTransferToFormType(values)).then(toggleModal);

  return (
    <Formik initialValues={initialData} validationSchema={validationSchema} onSubmit={submitTransfer}>
      {(model) => {
        const { values, touched, errors, handleSubmit, handleBlur, setFieldValue } = model;
        const { from, to, amount, rate, fee, feeAccount, executedAt, note } = values;

        return (
          <Form onSubmit={handleSubmit}>
            <FormGroup row>
              <Col md={6}>
                <FormGroup>
                  <Label for="from">From*</Label>
                  <Typeahead
                    allowNew
                    multiple={false}
                    id="from"
                    className="form-control-typeahead"
                    name="from"
                    inputProps={{ id: 'from' }}
                    placeholder="From account..."
                    isInvalid={touched.from && !!errors.from}
                    labelKey="name"
                    selected={from ? [from] : []}
                    onBlur={handleBlur}
                    onChange={(s) => setFieldValue('from', s.length ? s[0] : '')}
                    options={accounts}
                  />
                  <ErrorMessage component="div" name="from" className="invalid-feedback" />
                </FormGroup>
              </Col>
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
            </FormGroup>
            <FormGroup row>
              <Col md={6}>
                <FormGroup>
                  <Label for="to">To*</Label>
                  <Typeahead
                    allowNew
                    multiple={false}
                    id="to"
                    className="form-control-typeahead"
                    name="to"
                    inputProps={{ id: 'to' }}
                    placeholder="To account..."
                    isInvalid={touched.to && !!errors.to}
                    labelKey="name"
                    selected={to ? [to] : []}
                    onBlur={handleBlur}
                    onChange={(s) => setFieldValue('to', s.length ? s[0] : '')}
                    options={accounts}
                  />
                  <ErrorMessage component="div" name="to" className="invalid-feedback" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="rate">Rate*</Label>
                  <Field
                    as={Input}
                    id="rate"
                    name="rate"
                    type="number"
                    min={0}
                    step="any"
                    placeholder="Enter the rate"
                    invalid={touched.rate && !!errors.rate}
                    value={rate}
                  />
                  <ErrorMessage component="div" name="rate" className="invalid-feedback" />
                </FormGroup>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md={6}>
                <FormGroup>
                  <Label for="fee">Fee</Label>
                  <Field
                    as={Input}
                    id="fee"
                    name="fee"
                    type="number"
                    min={0}
                    step="any"
                    invalid={touched.fee && !!errors.fee}
                    value={fee}
                  />
                  <ErrorMessage component="div" name="fee" className="invalid-feedback" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="to">Fee paid from</Label>
                  <Typeahead
                    allowNew
                    multiple={false}
                    id="feeAccount"
                    className="form-control-typeahead"
                    name="feeAccount"
                    inputProps={{ id: 'feeAccount' }}
                    placeholder="Select account that pays the fee..."
                    isInvalid={touched.feeAccount && !!errors.feeAccount}
                    labelKey="name"
                    selected={feeAccount ? [feeAccount] : []}
                    onBlur={handleBlur}
                    onChange={(s) => setFieldValue('feeAccount', s.length ? s[0] : '')}
                    options={accounts}
                  />
                  <ErrorMessage component="div" name="feeAccount" className="invalid-feedback" />
                </FormGroup>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md={6}>
                <FormGroup>
                  <Label for="executedAt">Executed At*</Label>
                  <Field
                    as={Input}
                    type="datetime-local"
                    name="executedAt"
                    id="executedAt"
                    value={executedAt}
                    invalid={touched.executedAt && !!errors.executedAt}
                  />
                  <ErrorMessage component="div" name="executedAt" className="invalid-feedback" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="amountCalculated">Result amount</Label>
                  <Input
                    disabled
                    id="amountCalculated"
                    name="amountCalculated"
                    type="number"
                    step="any"
                    value={amount * rate}
                  />
                </FormGroup>
              </Col>
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

            <FormGroup check row>
              <Col
                sm={{
                  size: 5,
                  offset: 7,
                }}
              >
                <LoadingButton isLoading={isLoading} className="pull-right" />
                <div className="clearfix" />
              </Col>
            </FormGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

TransferForm.defaultProps = {
  isLoading: false,
};

TransferForm.propTypes = {
  registerTransfer: PropTypes.func.isRequired,
  model: transferType,
  isLoading: PropTypes.bool,
  toggleModal: PropTypes.func,
};

export default connect(null, {
  registerTransfer,
})(TransferForm);
