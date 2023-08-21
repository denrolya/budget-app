import { createActions } from 'reduxsauce';

import { updateStatistics } from 'src/store/actions/ui';
import { getUser, setBaseCurrency } from 'src/utils/auth';
import axios from 'src/utils/http';
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

  const { username } = getUser();

  try {
    await axios.put(`api/users/${username}`, {
      baseCurrency: currency,
    });

    dispatch(Creators.switchBaseCurrencySuccess(currency));

    setBaseCurrency(currency);
    dispatch(updateStatistics());
    notify('success', 'Switched currency');
  } catch (e) {
    notify('error', 'Switch Base Currency');
    dispatch(Creators.switchBaseCurrencyFailure(e));
  }
};
