import axios from 'src/services/http';
import { createActions } from 'reduxsauce';

import Routing, { isOnDashboardPage } from 'src/services/routing';
import { authorize } from 'src/store/actions/auth';
import { updateDashboard } from 'src/store/actions/dashboard';
import { notify } from 'src/store/actions/global';

export const { Types, Creators } = createActions(
  {
    switchBaseCurrencyRequest: null,
    switchBaseCurrencySuccess: null,
    switchBaseCurrencyFailure: ['message'],
  },
  { prefix: 'USER_' },
);

export const switchBaseCurrency = (code) => (dispatch) => {
  dispatch(Creators.switchBaseCurrencyRequest());

  return axios
    .put(Routing.generate('api_v1_user_update_base_currency'), {
      currency: code,
    })
    .then(({ data }) => {
      dispatch(Creators.switchBaseCurrencySuccess());
      dispatch(authorize(data.token, false));

      notify('success', 'Switched currency');

      if (isOnDashboardPage()) {
        dispatch(updateDashboard());
      }
    })
    .catch((e) => {
      console.error(e);
      dispatch(Creators.switchBaseCurrencyFailure(e.message));
    });
};
