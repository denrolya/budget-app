import { createReducer } from 'reduxsauce';

import { Types } from 'src/store/actions/category';

const INITIAL_STATE = {
  list: [],
};

// eslint-disable-next-line default-param-last
const fetchListSuccessHandler = (state = INITIAL_STATE, { categories: list }) => ({
  ...state,
  list,
});

const HANDLERS = {
  [Types.FETCH_LIST_SUCCESS]: fetchListSuccessHandler,
};

export default createReducer(INITIAL_STATE, HANDLERS);
