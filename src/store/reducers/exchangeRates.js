import { createReducer } from 'reduxsauce';

import { Types } from 'src/store/actions/exchangeRates';

const INITIAL_STATE = {};

const HANDLERS = {
  // eslint-disable-next-line no-unused-vars
  [Types.FETCH_SUCCESS]: (state = INITIAL_STATE, { rates }) => rates,
};

export default createReducer(INITIAL_STATE, HANDLERS);
