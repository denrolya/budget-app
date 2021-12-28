import { List } from 'immutable';
import { createReducer } from 'reduxsauce';

import Transfer from 'src/models/Transfer';
import { Types } from 'src/store/actions/transfer';
import TransferFilters from 'src/models/TransferFilters';
import Pagination from 'src/models/Pagination';
import { ROUTE_TRANSFERS } from 'src/constants/routes';
import { getTransferListQueryParams } from 'src/services/routing';

const INITIAL_STATE = {
  data: new List(),
  pagination: new Pagination({
    filters: new TransferFilters(),
  }),
};

const fetchListSuccessHandler = (state = INITIAL_STATE, { data, count }) => ({
  ...state,
  data: new List(data.map((transfer) => new Transfer(transfer))),
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
    filters: new TransferFilters(),
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
    filters: new TransferFilters(),
    page: 1,
    count: 0,
  }),
});

// TOOO: Implement using hooks
const locationChangeListener = (state = INITIAL_STATE, action) => {
  const { pathname, search } = action.payload.location;
  const { page, perPage, ...filters } = getTransferListQueryParams(search);

  const newPagination = new Pagination({
    page,
    perPage,
    filters: new TransferFilters(filters),
  });

  if (pathname !== ROUTE_TRANSFERS || (search && state.pagination.isEqual(newPagination))) {
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
