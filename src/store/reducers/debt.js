import { createReducer } from 'reduxsauce';

import { initializeList as initializeTransactionsList } from 'src/services/transaction';
import { Types } from 'src/store/actions/debt';

const INITIAL_STATE = {
  debts: [],
  withClosed: false,
};

const HANDLERS = {
  [Types.FETCH_LIST_SUCCESS]: (state = INITIAL_STATE, { debts }) => ({
    ...state,
    debts: debts.map(({ transactions, ...rest }) => ({
      ...rest,
      transactions: initializeTransactionsList(transactions),
    })),
  }),
  [Types.TOGGLE_WITH_CLOSED_FILTER]: (state = INITIAL_STATE) => ({
    ...state,
    withClosed: !state.withClosed,
  }),
};

export default createReducer(INITIAL_STATE, HANDLERS);
