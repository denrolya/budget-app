import React from 'react';
import { connect } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ROUTE_LOGIN } from 'src/constants/routes';

const AuthRequiredRoute = ({ isAuthenticated }) => isAuthenticated ? <Outlet /> : (
  <Navigate
    to={{
      pathname: ROUTE_LOGIN,
      state: { from: '/accounts' },
    }}
  />
);

AuthRequiredRoute.defaultProps = {
  isAuthenticated: false,
};

AuthRequiredRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated,
});

export default connect(mapStateToProps)(AuthRequiredRoute);
