import { createReducer } from 'reduxsauce';

import { Types } from 'src/store/actions/debt';

const INITIAL_STATE = [];

const HANDLERS = {
  [Types.FETCH_LIST_SUCCESS]: (_, { debts }) => debts,
  [Types.CREATE_SUCCESS]: (state, { debt }) => [...state, debt],
  [Types.EDIT_SUCCESS]: (state, { debt }) => state.map((d) => d.id === debt.id ? debt : d),
};

export default createReducer(INITIAL_STATE, HANDLERS);
