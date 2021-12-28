import { ErrorMessage, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { ChromePicker } from 'react-color';
import { FormGroup } from 'reactstrap';
import * as Yup from 'yup';

const AccountNameForm = ({ color, onSubmit }) => {
  const validationSchema = Yup.object({
    color: Yup.string().required('Required field'),
  });

  return (
    <Formik
      initialValues={{
        color,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form role="form">
          <FormGroup>
            <ChromePicker color={values.color} onChangeComplete={({ hex }) => setFieldValue('color', hex)} />
            <ErrorMessage component="div" name="color" className="invalid-feedback" />
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};

AccountNameForm.propTypes = {
  color: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AccountNameForm;
