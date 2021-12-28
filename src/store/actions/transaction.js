import axios from 'src/services/http';
import { createActions } from 'reduxsauce';

import Routing, { getTransactionListQueryParams, isOnDashboardPage, isOnTransactionsPage } from 'src/services/routing';
import { confirmTransactionCancellation, confirmTransactionDeletion } from 'src/services/transaction';
import { updateDashboard } from 'src/store/actions/dashboard';
import { notify } from 'src/store/actions/global';
import { fetchList as fetchAccounts } from 'src/store/actions/account';
import { fetchList as fetchDebts } from 'src/store/actions/debt';
import Pagination from 'src/models/Pagination';
import { ROUTE_TRANSACTIONS } from 'src/constants/routes';
import TransactionFilters from 'src/models/TransactionFilters';
import history from 'src/services/history';

export const { Types, Creators } = createActions(
  {
    fetchListRequest: null,
    fetchListSuccess: ['data', 'count', 'totalValue'],
    fetchListFailure: ['message'],

    registerRequest: null,
    registerSuccess: null,
    registerFailure: ['message'],

    editRequest: null,
    editSuccess: null,
    editFailure: ['message'],

    deleteRequest: null,
    deleteSuccess: ['transactionId'],
    deleteFailure: ['message'],

    setPagination: ['model'],
    setPage: ['page'],
    setPerPage: ['perPage'],
    resetPagination: null,

    setFilters: ['model'],
    resetFilters: null,
  },
  { prefix: 'TRANSACTION_' },
);

export const initializeList = () => (dispatch, getState) => {
  const { page, perPage, ...filters } = getTransactionListQueryParams(history.location.search);

  dispatch(
    setPagination(
      new Pagination({
        page,
        perPage,
        filters: new TransactionFilters(filters),
      }),
    ),
  );
};

export const fetchList = () => (dispatch, getState) => {
  const {
    perPage,
    page,
    filters: { from, to, accounts, categories, withCanceled, onlyDrafts, types },
  } = getState().transaction.pagination;

  dispatch(Creators.fetchListRequest());

  const queryParams = {
    types,
    perPage,
    page,
    from,
    to,
    accounts,
    categories,
    withCanceled: withCanceled ? 1 : 0,
    onlyDrafts: onlyDrafts ? 1 : 0,
  };

  return axios
    .get(Routing.generate(`api_v1_transaction_list`, queryParams))
    .then(({ data: { list, totalValue, count } }) => {
      dispatch(Creators.fetchListSuccess(list, count, totalValue));
    })
    .catch(({ message }) => dispatch(Creators.fetchListFailure(message)));
};

export const registerTransaction = (type, transaction) => (dispatch, getState) => {
  dispatch(Creators.registerRequest());

  return axios
    .post(Routing.generate(`api_v1_transaction_new`, { type }), {
      [type]: transaction,
    })
    .then(() => {
      dispatch(Creators.registerSuccess());
      notify('success', 'Transaction successfully registered', 'New transaction');

      if (isOnDashboardPage()) {
        dispatch(updateDashboard());
      }

      const { filters } = getState().transaction.pagination;

      if (isOnTransactionsPage() && (filters.hasType(type) || filters.types.length === 0)) {
        dispatch(fetchList());
      }

      dispatch(fetchAccounts());
      dispatch(fetchDebts());
    })
    .catch(({ message }) => dispatch(Creators.registerFailure(message)));
};

export const editTransaction = (id, type, transaction) => (dispatch, getState) => {
  dispatch(Creators.editRequest());

  return axios
    .put(Routing.generate(`api_v1_transaction_edit`, { id }), {
      [type]: transaction,
    })
    .then(() => {
      dispatch(Creators.editSuccess());
      notify('success', 'Given transaction was successfully modified.', 'Edited successfully');

      const { filters } = getState().transaction.pagination;

      if (isOnTransactionsPage() && (filters.hasType(type) || filters.types.length === 0)) {
        dispatch(fetchList());
      }

      dispatch(fetchAccounts());
      dispatch(fetchDebts());
    })
    .catch(({ message }) => dispatch(Creators.editFailure(message)));
};

/**
 * TODO: Refactor; Simplify, remove conditions for canceled and not canceled transactions; split maybe in 2 functions
 */
export const deleteTransaction = (transaction) => (dispatch, getState) => {
  const confirmation = transaction.canceledAt
    ? confirmTransactionDeletion(transaction)
    : confirmTransactionCancellation(transaction);
  return confirmation.then(({ value }) => {
    if (!value) {
      return;
    }

    dispatch(Creators.deleteRequest());

    axios
      .delete(Routing.generate(`api_v1_transaction_delete`, { id: transaction.id }))
      .then(() => {
        dispatch(Creators.deleteSuccess(transaction.id));

        notify(
          'success',
          `Transaction ${transaction.canceledAt ? 'deleted!' : 'canceled'}`,
          transaction.canceledAt ? 'DELETED' : 'Canceled',
        );

        if (isOnDashboardPage()) {
          dispatch(updateDashboard());
        }

        if (isOnTransactionsPage() && getState().transaction.pagination.filters.hasType(transaction.type)) {
          dispatch(fetchList());
        }

        if (!window.isMobile) {
          dispatch(fetchAccounts());
          dispatch(fetchDebts());
        }
      })
      .catch(({ message }) => dispatch(Creators.deleteFailure(message)));
  });
};

export const setPagination = (model) => (dispatch, getState) => {
  dispatch(Creators.setPagination(model));

  if (!getState().transaction.pagination.isEqual(model)) {
    history.push(`${ROUTE_TRANSACTIONS}?${model.getParamsQuery()}`);
  }
};

export const setPage = (page) => (dispatch, getState) => {
  dispatch(Creators.setPage(page));
  const model = getState().transaction.pagination.merge({
    page,
  });

  if (!getState().transaction.pagination.isEqual(model)) {
    history.push(`${ROUTE_TRANSACTIONS}?${model.getParamsQuery()}`);
  }
};

export const setPerPage = (perPage) => (dispatch, getState) => {
  dispatch(Creators.setPerPage(perPage));
  const model = getState().transaction.pagination.merge({
    perPage,
  });

  if (!getState().transaction.pagination.isEqual(model)) {
    history.push(`${ROUTE_TRANSACTIONS}?${model.getParamsQuery()}`);
  }
};

export const resetPagination = () => (dispatch) => dispatch(Creators.resetPagination());

export const setFilters = (filters) => (dispatch, getState) => {
  const { pagination } = getState().transaction;
  dispatch(Creators.setFilters(filters));
  const model = pagination.merge({
    filters,
  });

  if (!getState().transaction.pagination.isEqual(model)) {
    history.push(`${ROUTE_TRANSACTIONS}?${model.getParamsQuery()}`);
  }
};

export const resetFilters = () => (dispatch, getState) => {
  dispatch(Creators.resetFilters());
  const model = getState().transaction.pagination.merge({
    filters: new TransactionFilters(),
  });

  if (!getState().transaction.pagination.isEqual(model)) {
    history.push(`${ROUTE_TRANSACTIONS}?${model.getParamsQuery()}`);
  }
};
