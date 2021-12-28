import { createReducer } from 'reduxsauce';

import { Types } from 'src/store/actions/account';

const INITIAL_STATE = [];

const HANDLERS = {
  [Types.EDIT_SUCCESS]: (state = INITIAL_STATE, { account }) =>
    state.map((a) =>
      a.id === account.id
        ? {
          ...a,
          ...account,
        }
        : a,
    ),
  [Types.FETCH_LIST_SUCCESS]: (state = INITIAL_STATE, { list }) => list,
};

export default createReducer(INITIAL_STATE, HANDLERS);
