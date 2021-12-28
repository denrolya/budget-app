import { createReducer } from 'reduxsauce';

import { Types } from 'src/store/actions/exchangeRates';

const INITIAL_STATE = {};

const HANDLERS = {
  [Types.FETCH_SUCCESS]: (state = INITIAL_STATE, { rates }) => rates,
};

export default createReducer(INITIAL_STATE, HANDLERS);
