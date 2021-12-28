import React from 'react';
import { Provider } from 'react-redux';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import 'src/assets/scss/black-dashboard-react.scss';
import AuthRequiredRoute from 'src/components/AuthRequiredRoute';
import { ROUTE_LOGIN } from 'src/constants/routes';
import 'src/middlewares/axios';
import 'src/middlewares/toastr';
import { assertAuthorization } from 'src/store/actions/auth';
import store from 'src/store/store';
import history from 'src/services/history';
import App from 'src/containers/App';
import Login from 'src/containers/Login';

const Root = () => {
  store.dispatch(assertAuthorization());

  return (
      <Provider store={ store }>
        <BrowserRouter history={ history }>
          <Routes>
            <Route path="/" element={ <AuthRequiredRoute /> }>
              <Route path="/*" element={ <App /> } />
            </Route>
            <Route exact path={ ROUTE_LOGIN } element={ <Login /> } />
          </Routes>
        </BrowserRouter>
      </Provider>
  );
};

export default Root;
