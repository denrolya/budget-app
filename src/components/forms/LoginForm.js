import { ErrorMessage, Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => logIn(values)}
        >
          {(model) => (
            <Form onSubmit={model.handleSubmit}>
              <FormGroup>
                <InputGroup className="mb-0">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i aria-hidden className="fa fa-user" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Field
                    autoFocus
                    as={Input}
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    invalid={model.touched.username && !!model.errors.username}
                    value={model.values.username}
                  />
                </InputGroup>
                <ErrorMessage component="div" name="username" className="invalid-feedback" />
              </FormGroup>
              <FormGroup>
                <InputGroup className="mb-0">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i aria-hidden className="fa fa-lock" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Field
                    as={Input}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    invalid={model.touched.password && !!model.errors.password}
                    value={model.values.password}
                  />
                </InputGroup>
                <ErrorMessage component="div" name="password" className="invalid-feedback" />
              </FormGroup>
              <Button block type="submit" className="mb-3" color="primary" size="lg" disabled={isLoading}>
                {isLoading && <i aria-hidden className="tim-icons icon-refresh-02 fa-spin" />}
                {!isLoading && 'Log In' }
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
