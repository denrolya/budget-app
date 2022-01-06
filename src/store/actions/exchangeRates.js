import axios from 'src/services/http';
import { createActions } from 'reduxsauce';
import moment from 'moment-timezone';

import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';

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

  const { data } = await axios.get(`api/exchange-rates/${moment().format(MOMENT_DATE_FORMAT)}`);
  dispatch(Creators.fetchSuccess(data.rates));
};
