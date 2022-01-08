import axios from 'src/services/http';
import { createActions } from 'reduxsauce';
import moment from 'moment-timezone';

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
import { SERVER_TIMEZONE } from 'src/constants/datetime';

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

/**
 * TODO: Refactor using react-router v6. Now history.location.search is always empty
 */
export const initializeList = () => (dispatch) => {
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
    filters: {
      from, to, accounts, categories, withCanceled, onlyDrafts, types,
    },
  } = getState().transaction.pagination;

  dispatch(Creators.fetchListRequest());

  const params = {
    types,
    perPage,
    page,
    categories,
    accounts,
    'executedAt[strictly_after]': from,
    'executedAt[strictly_before]': to,
    withDeleted: withCanceled ? 1 : 0,
    isDraft: onlyDrafts ? 1 : 0,
  };

  return axios
    .get('api/transactions', { params })
    .then(({ data }) => {
      dispatch(Creators.fetchListSuccess(data['hydra:member'], data['hydra:totalItems']));
    })
    .catch(({ message }) => {
      notify('error', '[Error]: Fetch Transaction List');
      dispatch(Creators.fetchListFailure(message));
    });
};

export const registerTransaction = (type, transaction) => (dispatch, getState) => {
  dispatch(Creators.registerRequest());

  return axios
    .post(`api/transactions/${type}`, {
      ...transaction,
      amount: String(transaction.amount),
      executedAt: moment(transaction.executedAt).tz(SERVER_TIMEZONE).format(),
      compensations: transaction.compensations.map((c) => ({
        ...c,
        amount: String(c.amount),
        executedAt: moment(c.executedAt).tz(SERVER_TIMEZONE).format(),
      })),
    })
    .then(() => {
      dispatch(Creators.registerSuccess());
      notify('success', 'Transaction registered');

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
    .catch((e) => {
      notify('error', '[Error]: Register Transaction');
      dispatch(Creators.registerFailure(e.message));
    });
};

export const editTransaction = (id, type, transaction) => (dispatch, getState) => {
  dispatch(Creators.editRequest());

  return axios
    .put(`api/transactions/${id}`, transaction)
    .then(() => {
      dispatch(Creators.editSuccess());
      notify('success', `Transaction ${id} edited successfully`);

      const { filters } = getState().transaction.pagination;

      if (isOnTransactionsPage() && (filters.hasType(type) || filters.types.length === 0)) {
        dispatch(fetchList());
      }

      dispatch(fetchAccounts());
      dispatch(fetchDebts());
    })
    .catch((e) => {
      notify('error', '[Error]: Edit Transaction');
      dispatch(Creators.editFailure(e.message));
    });
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
      .delete(Routing.generate('api_v1_transaction_delete', { id: transaction.id }))
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
      .catch(({ message }) => {
        notify('error', '[Error]: Delete Transaction');
        dispatch(Creators.deleteFailure(message));
      });
  });
};

export const setPagination = (model) => (dispatch, getState) => {
  if (!getState().transaction.pagination.isEqual(model)) {
    dispatch(Creators.setPagination(model));
    history.push(`${ROUTE_TRANSACTIONS}?${model.getParamsQuery()}`);
  }
};

export const setPage = (page) => (dispatch, getState) => {
  const model = getState().transaction.pagination.merge({
    page,
  });

  if (!getState().transaction.pagination.page !== page) {
    dispatch(Creators.setPage(page));
    history.push(`${ROUTE_TRANSACTIONS}?${model.getParamsQuery()}`);
  }
};

export const setPerPage = (perPage) => (dispatch, getState) => {
  const model = getState().transaction.pagination.merge({
    perPage,
  });

  if (getState().transaction.pagination.perPage !== perPage) {
    dispatch(Creators.setPerPage(perPage));
    history.push(`${ROUTE_TRANSACTIONS}?${model.getParamsQuery()}`);
  }
};

export const resetPagination = () => (dispatch) => dispatch(Creators.resetPagination());

export const setFilters = (filters) => (dispatch, getState) => {
  const { pagination } = getState().transaction;
  const model = pagination.merge({
    filters,
  });

  if (!getState().transaction.pagination.isEqual(model)) {
    dispatch(Creators.setFilters(filters));
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
