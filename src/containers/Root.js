import React from 'react';
import { Provider } from 'react-redux';
import { ReduxRouter } from '@lagunovsky/redux-react-router';

import 'src/assets/scss/index.scss';
import 'src/middlewares/axios';
import 'src/middlewares/toastr';
import store from 'src/store/store';
import history from 'src/utils/history';
import Routing from 'src/containers/Routing';
import { assertAuthorization } from 'src/store/actions/auth';

const Root = () => {
  store.dispatch(assertAuthorization());

  return (
    <Provider store={store}>
      <ReduxRouter history={history} store={store}>
        <Routing />
      </ReduxRouter>
    </Provider>
  );
};

export default Root;
