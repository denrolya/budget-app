import React from 'react';
import { Provider } from 'react-redux';
import { ReduxRouter } from '@lagunovsky/redux-react-router';

import 'src/assets/scss/index.scss';
import 'src/middlewares/axios';
import 'src/middlewares/toastr';
import store from 'src/store/store';
import history from 'src/services/history';
import App from 'src/containers/App';
import { assertAuthorization } from 'src/store/actions/auth';

const Root = () => {
  store.dispatch(assertAuthorization());

  return (
    <Provider store={store}>
      <ReduxRouter history={history} store={store}>
        <App />
      </ReduxRouter>
    </Provider>
  );
};

export default Root;
