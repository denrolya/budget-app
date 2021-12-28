import { createReducer } from 'reduxsauce';

import { initializeList as initializeTransactionsList } from 'src/services/transaction';
import { Types } from 'src/store/actions/transaction';
import Pagination from 'src/models/Pagination';
import TransactionFilters from 'src/models/TransactionFilters';
import { ROUTE_TRANSACTIONS } from 'src/constants/routes';
import { getTransactionListQueryParams } from 'src/services/routing';

const INITIAL_STATE = {
  data: [],
  totalValue: 0,
  pagination: new Pagination({
    filters: new TransactionFilters(),
  }),
};

const fetchListSuccessHandler = (state = INITIAL_STATE, { data, totalValue, count }) => ({
  ...state,
  totalValue,
  data: initializeTransactionsList(data),
  pagination: state.pagination.set('count', count),
});

const deleteSuccessHandler = (state = INITIAL_STATE, { transactionId }) => ({
  ...state,
  data: state.data.filter(({ id }) => id !== transactionId),
});

const setPaginationHandler = (state = INITIAL_STATE, { model: pagination }) => ({
  ...state,
  pagination,
});

const setPageHandler = (state = INITIAL_STATE, { page }) => ({
  ...state,
  pagination: state.pagination.set('page', page),
});

const setPerPageHandler = (state = INITIAL_STATE, { perPage }) => ({
  ...state,
  pagination: state.pagination.set('perPage', perPage),
});

const resetPaginationHandler = (state = INITIAL_STATE) => ({
  ...state,
  pagination: new Pagination({
    filters: new TransactionFilters(),
  }),
});

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

// TODO: Implement using hooks
const locationChangeListener = (state = INITIAL_STATE, action) => {
  const { pathname, search } = action.payload.location;
  const { page, perPage, ...filters } = getTransactionListQueryParams(search);

  const newPagination = new Pagination({
    page,
    perPage,
    filters: new TransactionFilters(filters),
  });

  if (pathname !== ROUTE_TRANSACTIONS || (search && state.pagination.isEqual(newPagination))) {
    return { ...state };
  }

  return {
    ...state,
    pagination: newPagination,
  };
};

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
