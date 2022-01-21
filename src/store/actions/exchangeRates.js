import { createActions } from 'reduxsauce';

import Routing from 'src/services/routing';
import axios from 'src/services/http';
import { notify } from 'src/store/actions/global';

export const { Types, Creators } = createActions(
  {
    fetchRequest: null,
    fetchSuccess: ['rates'],
    fetchFailure: ['message'],
  },
  { prefix: 'EXCHANGE_RATES_' },
);

export const fetch = () => async (dispatch) => {
  dispatch(Creators.fetchRequest());

  try {
    const { data } = await axios.get(Routing.generate('api_v1_currency_rates'));
    dispatch(Creators.fetchSuccess(data));
  } catch (e) {
    notify('error', '[Error]: Fetch Exchange Rates');
    dispatch(Creators.fetchFailure(e));
  }
};
