import { createReducer } from 'reduxsauce';

import { Types } from 'src/store/actions/category';

const INITIAL_STATE = {
  list: [],
  tree: {
    expense: [],
    income: [],
  },
};

// eslint-disable-next-line default-param-last
const fetchListSuccessHandler = (state = INITIAL_STATE, { categories: list }) => ({
  ...state,
  list,
});

// eslint-disable-next-line default-param-last
const updateTreeSuccessHandler = (state = INITIAL_STATE, { categoryType, treeData }) => ({
  ...state,
  tree: {
    ...state.tree,
    [categoryType]: treeData,
  },
});

const HANDLERS = {
  [Types.FETCH_LIST_SUCCESS]: fetchListSuccessHandler,
  [Types.FETCH_TREE_SUCCESS]: updateTreeSuccessHandler,
  [Types.UPDATE_TREE]: updateTreeSuccessHandler,
};

export default createReducer(INITIAL_STATE, HANDLERS);
