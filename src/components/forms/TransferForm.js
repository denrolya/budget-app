import { ErrorMessage, Field, Formik } from 'formik';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {
  Col, Form, FormGroup, Input, Label,
} from 'reactstrap';
import * as Yup from 'yup';

import { useActiveAccounts } from 'src/contexts/AccountsContext';
import LoadingButton from 'src/components/LoadingButton';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { registerTransfer } from 'src/store/actions/transfer';

const TransferForm = ({
  isLoading, registerTransfer, toggleModal,
}) => {
  const accountOptions = useActiveAccounts();
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
    from: Yup.number().required('Required field'),
    to: Yup.number().required('Required field'),
    amount: Yup.number().required('Required field'),
    rate: Yup.number().moreThan(0, 'Invalid value').required('Required field'),
    fee: Yup.number(),
    feeAccount: Yup.number(),
    executedAt: Yup.string().required('Required field'),
    note: Yup.string(),
  });

  const submitTransfer = (values) => registerTransfer(values).then(toggleModal);

  return (
    <Formik initialValues={initialData} validationSchema={validationSchema} onSubmit={submitTransfer}>
      {({
        values: {
          from, to, amount, rate, fee, feeAccount, executedAt, note,
        },
        touched,
        errors,
        handleSubmit,
        setFieldValue,
      }) => (
        <Form onSubmit={handleSubmit}>
          <FormGroup row>
            <Col md={6}>
              <FormGroup>
                <Label for="fromSelect">From*</Label>
                <Input
                  type="select"
                  name="from"
                  id="fromSelect"
                  value={from}
                  onChange={({ target }) => setFieldValue('from', target.value)}
                >
                  <option value="">------------</option>
                  {accountOptions.map(({ id, name, archivedAt }) => (
                    <option key={`from-option-${id}`} value={parseInt(id, 10)}>
                      {name}
                      {' '}
                      {archivedAt ? `(Archived ${moment(archivedAt).calendar()})` : ''}
                    </option>
                  ))}
                </Input>
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
                <Label for="toSelect">To*</Label>
                <Input
                  type="select"
                  name="to"
                  id="toSelect"
                  value={to}
                  onChange={({ target }) => setFieldValue('to', target.value)}
                >
                  <option value="">------------</option>
                  {accountOptions.map(({ id, name, archivedAt }) => (
                    <option key={`to-option-${id}`} value={parseInt(id, 10)}>
                      {name}
                      {' '}
                      {archivedAt ? `(Archived ${moment(archivedAt).calendar()})` : ''}
                    </option>
                  ))}
                </Input>
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
                <Label for="feeAccount">Fee paid from</Label>
                <Input
                  type="select"
                  name="feeAccount"
                  id="feeAccountSelect"
                  value={feeAccount}
                  onChange={({ target }) => setFieldValue('feeAccount', target.value)}
                >
                  <option value="">------------</option>
                  {accountOptions.map(({ id, name, archivedAt }) => (
                    <option key={`feeAccount-option-${id}`} value={parseInt(id, 10)}>
                      {name}
                      {' '}
                      {archivedAt ? `(Archived ${moment(archivedAt).calendar()})` : ''}
                    </option>
                  ))}
                </Input>
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
      )}
    </Formik>
  );
};

TransferForm.defaultProps = {
  isLoading: false,
};

TransferForm.propTypes = {
  registerTransfer: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  toggleModal: PropTypes.func,
};

export default connect(null, { registerTransfer })(TransferForm);
