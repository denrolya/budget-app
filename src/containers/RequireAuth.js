import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { ROUTE_LOGIN } from '../constants/routes';

// eslint-disable-next-line react/prop-types
const RequireAuth = ({ isAuthenticated, children }) => {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate replace to={ROUTE_LOGIN} state={{ from: location }} />;
  }

  return children;
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({ isAuthenticated });

export default connect(mapStateToProps)(RequireAuth);
