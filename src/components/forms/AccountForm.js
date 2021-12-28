import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import { Button, Col, FormGroup, Input, Label } from 'reactstrap';
import { CirclePicker } from 'react-color';
import * as Yup from 'yup';

import LoadingButton from 'src/components/LoadingButton';
import { createAccount } from 'src/store/actions/account';
import { isActionLoading } from 'src/services/common';
import {
  ACCOUNT_TYPE_BANK_CARD,
  ACCOUNT_TYPE_BASIC,
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_INTERNET,
} from 'src/constants/account';
import { CURRENCIES } from 'src/constants/currency';

const AccountForm = ({ isLoading, toggleModal, createAccount }) => {
  const typeaheadsRefs = [];
  const [form, setForm] = useState({
    initialValues: {
      name: '',
      currency: '',
      color: '#ffffff',
      balance: 0,
      type: 'basic',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required field'),
      currency: Yup.string('Not a string!!').required('Required field'),
      balance: Yup.number().required('Required field'),
      color: Yup.string().required('Required field'),
      type: Yup.string().required('Required field'),
      iban: Yup.string(), // TODO: Required for bank type
      cardNumber: Yup.string(), // TODO: Required for bank type
      monobankId: Yup.string(), // TODO: Required for bank type
    }),
  });

  const submitAccount = async (values) => {
    await createAccount(values);
    toggleModal();
  };

  return (
    <Formik
      enableReinitialize
      validateOnBlur
      validateOnChange
      validateOnMount
      initialValues={form.initialValues}
      validationSchema={form.validationSchema}
      onSubmit={submitAccount}
    >
      {({ values, errors, touched, setFieldValue, handleBlur, isValid }) => (
        <Form role="form">
          <FormGroup row>
            <Col>
              <FormGroup>
                <Label for="name">Name*</Label>
                <Field
                  autoFocus
                  id="name"
                  name="name"
                  type="text"
                  as={Input}
                  invalid={touched.name && !!errors.name}
                  value={values.name}
                />
                <ErrorMessage component="div" name="name" className="invalid-feedback" />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="currency">Currency</Label>
                <Typeahead
                  id="currency"
                  className="form-control-typeahead"
                  name="currency"
                  inputProps={{ id: 'currency' }}
                  isInvalid={touched.currency && !!errors.currency}
                  ref={(t) => t && typeaheadsRefs.push(t)}
                  labelKey="name"
                  selected={values.currency ? [CURRENCIES[values.currency]] : []}
                  onBlur={handleBlur}
                  onChange={(selected) =>
                    setFieldValue('currency', selected.length > 0 ? selected[0].code : undefined, true)
                  }
                  options={Object.values(CURRENCIES)}
                />
                <ErrorMessage component="div" name="currency" className="invalid-feedback" />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <CirclePicker color={values.color} onChangeComplete={({ hex }) => setFieldValue('color', hex)} />
                <ErrorMessage component="div" name="color" className="invalid-feedback" />
              </FormGroup>
            </Col>
          </FormGroup>

          <FormGroup>
            <Label for="balance">Balance</Label>
            <Field
              autoFocus
              id="balance"
              name="balance"
              type="number"
              step="any"
              as={Input}
              invalid={touched.balance && !!errors.balance}
              value={values.balance}
            />
            <ErrorMessage component="div" name="balance" className="invalid-feedback" />
          </FormGroup>

          <FormGroup check className="form-check-radio">
            <Button
              className="btn-icon btn-link"
              color="info"
              type="button"
              active={values.type === ACCOUNT_TYPE_BASIC}
              onClick={() => setFieldValue('type', ACCOUNT_TYPE_BASIC)}
            >
              <i aria-hidden className="ion-ios-wallet fa-2x" />
            </Button>
            <Button
              className="btn-icon btn-link"
              color="danger"
              type="button"
              active={values.type === ACCOUNT_TYPE_CASH}
              onClick={() => setFieldValue('type', ACCOUNT_TYPE_CASH)}
            >
              <i aria-hidden className="ion-ios-cash fa-2x" />
            </Button>

            <Button
              className="btn-icon btn-link"
              color="success"
              type="button"
              active={values.type === ACCOUNT_TYPE_BANK_CARD}
              onClick={() => setFieldValue('type', ACCOUNT_TYPE_BANK_CARD)}
            >
              <i aria-hidden className="ion-ios-card fa-2x" />
            </Button>
            <Button
              className="btn-icon btn-link"
              color="warning"
              type="button"
              active={values.type === ACCOUNT_TYPE_INTERNET}
              onClick={() => setFieldValue('type', ACCOUNT_TYPE_INTERNET)}
            >
              <i aria-hidden className="ion-ios-globe fa-2x" />
            </Button>
          </FormGroup>

          {values.type === ACCOUNT_TYPE_BANK_CARD && (
            <>
              <FormGroup row>
                <Col>
                  <FormGroup>
                    <Label for="iban">IBAN</Label>
                    <Field
                      autoFocus
                      id="iban"
                      name="iban"
                      type="text"
                      as={Input}
                      invalid={touched.iban && !!errors.iban}
                      value={values.iban}
                    />
                    <ErrorMessage component="div" name="iban" className="invalid-feedback" />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="cardNumber">Card Number</Label>
                    <Field
                      autoFocus
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      as={Input}
                      invalid={touched.cardNumber && !!errors.cardNumber}
                      value={values.cardNumber}
                    />
                    <ErrorMessage component="div" name="cardNumber" className="invalid-feedback" />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="iban">Monobank ID</Label>
                    <Field
                      autoFocus
                      id="monobankId"
                      name="monobankId"
                      type="text"
                      as={Input}
                      invalid={touched.monobankId && !!errors.monobankId}
                      value={values.monobankId}
                    />
                    <ErrorMessage component="div" name="monobankId" className="invalid-feedback" />
                  </FormGroup>
                </Col>
              </FormGroup>
            </>
          )}

          <FormGroup check row>
            <Col sm={12}>
              <LoadingButton
                className="pull-right"
                color="primary"
                type="submit"
                isLoading={isLoading}
                disabled={!isValid}
              />
              <div className="clearfix" />
            </Col>
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};

AccountForm.defaultProps = {
  isLoading: false,
};

AccountForm.propTypes = {
  createAccount: PropTypes.func.isRequired,
  toggleModal: PropTypes.func,
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ ui }) => ({
  isLoading: isActionLoading(ui.ACCOUNT_CREATE),
});

export default connect(mapStateToProps, { createAccount })(AccountForm);
