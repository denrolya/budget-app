import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Formik, Form, Field } from 'formik';
import { Input, Label } from 'reactstrap';
import * as Yup from 'yup';
import capitalize from 'voca/capitalize';

const AccountNameForm = ({ value, onSubmit }) => {
  const [form, setForm] = useState({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required field!'),
    }),
  });

  useEffect(() => {
    setForm({
      ...form,
      initialValues: {
        name: value,
      },
    });
  }, [value]);

  return (
    <Formik
      enableReinitialize
      validateOnBlur
      validateOnMount
      validateOnChange
      initialValues={form.initialValues}
      validationSchema={form.validationSchema}
      onSubmit={onSubmit}
    >
      {({ dirty, values, touched, errors, setFieldValue, resetForm }) => {
        // TODO: reset form on escape keyPress or add x button

        return (
          <Form role="form">
            <Label for="name" className="d-none">
              Name
            </Label>
            <Field
              id="name"
              name="name"
              type="text"
              bsSize="lg"
              placeholder="Account name"
              style={{
                height: '100%',
              }}
              className={cn('mb-0', {
                'border-0': value === values.name && !(touched.name && !!errors.name),
                'border-info': value !== values.name || (dirty && !(touched.name && !!errors.name)),
                'border-danger': touched.name && !!errors.name,
              })}
              as={Input}
              invalid={touched.name && !!errors.name}
              onChange={({ target }) => setFieldValue('name', capitalize(target.value))}
              value={values.name}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

AccountNameForm.propTypes = {
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AccountNameForm;
