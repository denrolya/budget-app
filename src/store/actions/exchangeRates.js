import axios from 'src/services/http';
import { createActions } from 'reduxsauce';
import Routing from 'src/services/routing';

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

  const { data } = await axios.get(Routing.generate('api_v1_currency_rates'));
  dispatch(Creators.fetchSuccess(data));
};
