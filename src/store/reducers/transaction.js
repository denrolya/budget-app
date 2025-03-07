import { createReducer } from 'reduxsauce';
import Transaction from 'src/models/Transaction';

import { Types } from 'src/store/actions/transaction';
import Pagination from 'src/models/Pagination';
import TransactionFilters from 'src/models/TransactionFilters';

const INITIAL_STATE = {
  data: [],
  totalValue: 0,
  pagination: new Pagination({
    filters: new TransactionFilters(),
  }),
};

// eslint-disable-next-line default-param-last
const fetchListSuccessHandler = (state = INITIAL_STATE, { data, totalValue, count }) => {
  return ({
    ...state,
    totalValue,
    data,
    pagination: state.pagination.set('count', count),
  });
};

// eslint-disable-next-line default-param-last
const deleteSuccessHandler = (state = INITIAL_STATE, { transactionId }) => ({
  ...state,
  data: state.data.filter(({ id }) => id !== transactionId),
});

// eslint-disable-next-line default-param-last
const setPaginationHandler = (state = INITIAL_STATE, { model: pagination }) => ({
  ...state,
  pagination,
});

// eslint-disable-next-line default-param-last
const setPageHandler = (state = INITIAL_STATE, { page }) => ({
  ...state,
  pagination: state.pagination.set('page', page),
});

// eslint-disable-next-line default-param-last
const setPerPageHandler = (state = INITIAL_STATE, { perPage }) => ({
  ...state,
  pagination: state.pagination.set('perPage', perPage),
});

// eslint-disable-next-line default-param-last
const resetPaginationHandler = (state = INITIAL_STATE) => ({
  ...state,
  pagination: new Pagination({
    filters: new TransactionFilters(),
  }),
});

// eslint-disable-next-line default-param-last
const setFiltersHandler = (state = INITIAL_STATE, { model: filters }) => ({
  ...state,
  pagination: state.pagination.merge({
    filters,
    page: 1,
    count: 0,
  }),
});

const resetFiltersHandler = (state = INITIAL_STATE) => ({
  ...state,
  pagination: state.pagination.merge({
    filters: new TransactionFilters(),
    page: 1,
    count: 0,
  }),
});

const HANDLERS = {
  [Types.FETCH_LIST_SUCCESS]: fetchListSuccessHandler,
  [Types.DELETE_SUCCESS]: deleteSuccessHandler,

  [Types.SET_PAGINATION]: setPaginationHandler,
  [Types.SET_PAGE]: setPageHandler,
  [Types.SET_PER_PAGE]: setPerPageHandler,
  [Types.RESET_PAGINATION]: resetPaginationHandler,

  [Types.SET_FILTERS]: setFiltersHandler,
  [Types.RESET_FILTERS]: resetFiltersHandler,
};

export default createReducer(INITIAL_STATE, HANDLERS);
