import { createReducer } from 'reduxsauce';

import { Types } from 'src/store/actions/category';

const INITIAL_STATE = {
  categories: [],
  categoriesTree: {
    expense: [],
    income: [],
  },
};

const fetchListSuccessHandler = (state = INITIAL_STATE, { categories }) => ({
  ...state,
  categories,
});

const updateTreeSuccessHandler = (state = INITIAL_STATE, { categoryType, treeData }) => ({
  ...state,
  categoriesTree: {
    ...state.categoriesTree,
    [categoryType]: treeData,
  },
});

const HANDLERS = {
  [Types.FETCH_LIST_SUCCESS]: fetchListSuccessHandler,
  [Types.FETCH_TREE_SUCCESS]: updateTreeSuccessHandler,
  [Types.UPDATE_TREE]: updateTreeSuccessHandler,
};

export default createReducer(INITIAL_STATE, HANDLERS);
