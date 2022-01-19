import {
  ErrorMessage, Field, Formik, Form,
} from 'formik';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import {
  Button, Col, FormGroup, Input, Label,
} from 'reactstrap';
import * as Yup from 'yup';

import ModalForm from 'src/components/forms/ModalForm';
import { CURRENCIES } from 'src/constants/currency';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { createDebt, editDebt } from 'src/store/actions/debt';

const DebtForm = ({
  model, isOpen, title, toggleModal, createDebt, editDebt,
}) => {
  const typeaheadsRefs = [];

  const initialValues = model
    ? ({
      ...model,
      createdAt: moment(model.createdAt).format(MOMENT_DATETIME_FORMAT),
      closedAt: model.closedAt ? moment(model.closedAt).format(MOMENT_DATETIME_FORMAT) : '',
    })
    : {
      debtor: '',
      currency: '',
      balance: 0,
      createdAt: moment().format(MOMENT_DATETIME_FORMAT),
      closedAt: '',
      note: '',
    };

  const validationSchema = Yup.object({
    debtor: Yup.string().required('Required field'),
    currency: Yup.string().required('Required field'),
    balance: Yup.number().required('Required field'),
    createdAt: Yup.string().required('Required field'),
    closedAt: Yup.string().nullable(),
    note: Yup.string(),
  });

  const onSubmit = async ({ id, ...values }) => {
    const submitPromise = id ? editDebt(id, values) : createDebt(values);

    await submitPromise;

    toggleModal();
  };

  return (
    <ModalForm
      title={title}
      isOpen={isOpen}
      toggleModal={() => toggleModal()}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleBlur,
        }) => (
          <Form>
            <FormGroup>
              <Label for="debtor">Debtor*</Label>
              <Field
                as={Input}
                type="text"
                name="debtor"
                id="debtor"
                value={values.debtor}
                invalid={touched.debtor && !!errors.debtor}
              />
              <ErrorMessage component="div" name="debtor" className="invalid-feedback" />
            </FormGroup>

            <FormGroup row>
              <Col md={6}>
                <FormGroup>
                  <Label for="balance">Balance*</Label>
                  <Field
                    as={Input}
                    step="any"
                    type="number"
                    name="balance"
                    id="balance"
                    value={values.balance}
                    invalid={touched.balance && !!errors.balance}
                  />
                  <ErrorMessage component="div" name="balance" className="invalid-feedback" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="currency">Currency*</Label>
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
                    onChange={(selected) => setFieldValue('currency', selected.length > 0 ? selected[0].code : undefined, true)}
                    options={Object.values(CURRENCIES)}
                  />
                  <ErrorMessage component="div" name="currency" className="invalid-feedback" />
                </FormGroup>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md={6}>
                <FormGroup>
                  <Label for="createdAt">Created At*</Label>
                  <Field
                    as={Input}
                    type="datetime-local"
                    name="createdAt"
                    id="createdAt"
                    value={values.createdAt}
                    invalid={touched.createdAt && !!errors.createdAt}
                  />
                  <ErrorMessage component="div" name="createdAt" className="invalid-feedback" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="closedAt">Closed At</Label>
                  <Field
                    as={Input}
                    type="datetime-local"
                    name="closedAt"
                    id="closedAt"
                    value={values.closedAt}
                    invalid={touched.closedAt && !!errors.closedAt}
                  />
                  <ErrorMessage component="div" name="closedAt" className="invalid-feedback" />
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
                value={values.note}
              />
              <ErrorMessage component="div" name="note" className="invalid-feedback" />
            </FormGroup>

            <FormGroup check row>
              <Col sm={12}>
                <Button className="pull-right" color="primary" type="submit">
                  Submit
                </Button>
                <div className="clearfix" />
              </Col>
            </FormGroup>
          </Form>
        )}
      </Formik>
    </ModalForm>
  );
};

DebtForm.defaultProps = {
  isOpen: false,
  title: 'New Debt',
};

DebtForm.propTypes = {
  // TODO: PropTypes
  createDebt: PropTypes.func.isRequired,
  editDebt: PropTypes.func.isRequired,
  model: PropTypes.object,
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
};

export default connect(null, {
  createDebt,
  editDebt,
})(DebtForm);
