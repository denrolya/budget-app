import { createReducer } from 'reduxsauce';

import { initializeList as initializeTransactionsList } from 'src/services/transaction';
import { Types } from 'src/store/actions/debt';

const INITIAL_STATE = [];

const HANDLERS = {
  // eslint-disable-next-line default-param-last,no-unused-vars
  [Types.FETCH_LIST_SUCCESS]: (state = INITIAL_STATE, { debts }) => debts.map(({ transactions, ...rest }) => ({
    ...rest,
    transactions: initializeTransactionsList(transactions),
  })),
  // eslint-disable-next-line default-param-last
  [Types.CREATE_SUCCESS]: (state = INITIAL_STATE, { debt }) => [
    ...state,
    {
      ...debt,
      transactions: initializeTransactionsList(debt.transactions),
    },
  ],
  // eslint-disable-next-line default-param-last
  [Types.EDIT_SUCCESS]: (state = INITIAL_STATE, { debt }) => state.map((d) => d.id === debt.id ? {
    ...debt,
    transactions: initializeTransactionsList(debt.transactions),
  } : d),
};

export default createReducer(INITIAL_STATE, HANDLERS);
