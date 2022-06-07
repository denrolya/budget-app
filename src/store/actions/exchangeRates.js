import { createActions } from 'reduxsauce';
import moment from 'moment-timezone';

import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import axios from 'src/utils/http';
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
    const { data } = await axios.get(`api/exchange-rates/${moment().format(MOMENT_DATE_FORMAT)}`);
    dispatch(Creators.fetchSuccess(data.rates));
  } catch (e) {
    notify('error', 'Fetch Exchange Rates');
    dispatch(Creators.fetchFailure(e));
  }
};
