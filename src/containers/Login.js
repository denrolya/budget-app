import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import LoginForm from 'src/components/forms/LoginForm';
import { isActionLoading } from 'src/utils/common';
import { loginUser } from 'src/store/actions/auth';

const Login = ({ isLoading, loginUser }) => (
  <>
    <Helmet>
      <title>Log In | Budget</title>
    </Helmet>
    <div className="wrapper">
      <div className="main-panel" data-color="blue">
        <div className="content d-flex">
          <Container className="align-self-center">
            <Row>
              <Col xs={10} sm={12} md={12} lg={6} xl={4} className="ml-auto">
                <LoginForm logIn={(credentials) => loginUser(credentials)} isLoading={isLoading} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  </>
);

Login.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ ui }) => ({
  isLoading: isActionLoading(ui.AUTH_LOGIN),
});

export default connect(mapStateToProps, { loginUser })(Login);
