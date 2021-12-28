import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import LoginForm from 'src/components/forms/LoginForm';
import { isActionLoading } from 'src/services/common';
import { loginUser } from 'src/store/actions/auth';

const Login = ({ isLoading, loginUser }) => {
  useEffect(() => {
    document.title = 'Log In | Budget';
  }, []);

  return (
    <div className="wrapper">
      <div className="main-panel" data="blue">
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
  );
};

Login.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ ui }) => ({
  isLoading: isActionLoading(ui.AUTH_LOGIN),
});

export default connect(mapStateToProps, { loginUser })(Login);
