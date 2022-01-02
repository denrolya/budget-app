import cn from 'classnames';
import { ErrorMessage, Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import * as Yup from 'yup';

import loginCardBg from 'src/assets/img/login-card.png';

const LoginForm = ({ isLoading, logIn }) => {
  const [selected, selectField] = useState();
  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().min(2, 'Too short').required('Required field'),
    password: Yup.string().min(2, 'Too short').required('Required field'),
  });

  return (
    <Card className="card-white card-login">
      <CardHeader>
        <img alt="..." src={loginCardBg} />
        <CardTitle tag="h1">Log In</CardTitle>
      </CardHeader>
      <CardBody>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(values) => logIn(values)}>
          {(model) => (
            <Form onSubmit={model.handleSubmit}>
              <FormGroup>
                <InputGroup
                  className={cn('mb-0', {
                    'has-danger': model.touched.username && !!model.errors.username,
                    'input-group-focus': selected === 'username',
                  })}
                >
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-user" aria-hidden />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Field
                    autoFocus
                    as={Input}
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    onFocus={() => selectField('username')}
                    onBlur={() => selectField()}
                    value={model.values.username}
                  />
                </InputGroup>
                <ErrorMessage component="div" name="username" className="invalid-feedback" />
              </FormGroup>
              <FormGroup>
                <InputGroup
                  className={cn('mb-0', {
                    'has-danger': model.touched.password && !!model.errors.password,
                    'input-group-focus': selected === 'password',
                  })}
                >
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-lock" aria-hidden />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Field
                    as={Input}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    onFocus={() => selectField('password')}
                    onBlur={() => selectField()}
                    value={model.values.password}
                  />
                </InputGroup>
                <ErrorMessage component="div" name="password" className="invalid-feedback" />
              </FormGroup>
              <Button block type="submit" className="mb-3" color="primary" size="lg" disabled={isLoading}>
                {!isLoading ? 'Log In' : <i className="tim-icons icon-refresh-02 fa-spin" />}
              </Button>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
};

LoginForm.propTypes = {
  logIn: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default LoginForm;
