import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import 'src/assets/scss/black-dashboard-react.scss';
import 'src/middlewares/axios';
import 'src/middlewares/toastr';
import store from 'src/store/store';
import history from 'src/services/history';
import App from 'src/containers/App';
import { assertAuthorization } from '../store/actions/auth';

const Root = () => {
  store.dispatch(assertAuthorization());

  return (
    <Provider store={store}>
      <BrowserRouter history={history}>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

export default Root;
