import { createActions } from 'reduxsauce';

import { notify } from 'src/store/actions/global';
import axios from 'src/utils/http';

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
    const { data } = await axios.get('api/v2/exchange-rates');
    dispatch(Creators.fetchSuccess(data.rates));
  } catch (e) {
    notify('error', 'Fetch Exchange Rates');
    dispatch(Creators.fetchFailure(e));
  }
};
