import { createActions } from 'reduxsauce';

import { getUser, setUser } from 'src/services/auth';
import axios from 'src/services/http';
import { isOnDashboardPage } from 'src/services/routing';
import { updateDashboard } from 'src/store/actions/dashboard';
import { notify } from 'src/store/actions/global';

export const { Types, Creators } = createActions(
  {
    switchBaseCurrencyRequest: null,
    switchBaseCurrencySuccess: ['currency'],
    switchBaseCurrencyFailure: ['message'],
  },
  { prefix: 'USER_' },
);

export const switchBaseCurrency = (currency) => async (dispatch) => {
  dispatch(Creators.switchBaseCurrencyRequest());

  const user = getUser();

  try {
    await axios.put(`api/users/${user.username}`, {
      baseCurrency: currency,
    });

    setUser(user);

    dispatch(Creators.switchBaseCurrencySuccess(currency));

    notify('success', 'Switched currency');

    if (isOnDashboardPage()) {
      dispatch(updateDashboard());
    }
  } catch (e) {
    notify('error', 'Switch Base Currency');
    dispatch(Creators.switchBaseCurrencyFailure(e));
  }
};
