import { createActions } from 'reduxsauce';
import moment from 'moment-timezone';

import axios from 'src/utils/http';
import { getTransactionListQueryParams, isOnDashboardPage, isOnTransactionsPage } from 'src/utils/routing';
import { transactionDeletionPrompt } from 'src/utils/prompts';
import { updateDashboard } from 'src/store/actions/dashboard';
import { notify } from 'src/store/actions/global';
import { fetchList as fetchAccounts } from 'src/store/actions/account';
import { fetchList as fetchDebts } from 'src/store/actions/debt';
import Pagination from 'src/models/Pagination';
import { ROUTE_TRANSACTIONS } from 'src/constants/routes';
import TransactionFilters from 'src/models/TransactionFilters';
import history from 'src/utils/history';
import { MOMENT_DEFAULT_DATE_FORMAT, SERVER_TIMEZONE } from 'src/constants/datetime';

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
  const { page, perPage, ...filters } = getTransactionListQueryParams(getState().router.location.search);

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

export const fetchList = () => async (dispatch, getState) => {
  dispatch(Creators.fetchListRequest());

  try {
    const {
      perPage,
      page,
      filters: {
        from,
        to,
        accounts,
        categories,
        onlyDrafts,
        types,
      },
    } = getState().transaction.pagination;

    const params = {
      type: types[0], // TODO: To be handled properly
      perPage,
      page,
      categories,
      accounts,
      after: from.clone().format(MOMENT_DEFAULT_DATE_FORMAT),
      before: to.clone().format(MOMENT_DEFAULT_DATE_FORMAT),
      isDraft: onlyDrafts ? 1 : 0,
    };

    const { data: { list, totalValue, count } } = await axios.get('api/v2/transaction', { params });

    dispatch(Creators.fetchListSuccess(list, count, totalValue));
  } catch (e) {
    notify('error', 'Fetch Transaction List');
    dispatch(Creators.fetchListFailure(e));
  }
};

export const registerTransaction = (type, transaction) => async (dispatch, getState) => {
  dispatch(Creators.registerRequest());

  try {
    await axios.post(`api/transactions/${type}`, {
      ...transaction,
      amount: String(transaction.amount),
      executedAt: moment(transaction.executedAt).tz(SERVER_TIMEZONE).format(),
      compensations: transaction.compensations?.map((c) => ({
        ...c,
        amount: String(c.amount),
        executedAt: moment(c.executedAt).tz(SERVER_TIMEZONE).format(),
      })),
    });

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
  } catch (e) {
    notify('error', 'Register Transaction');
    dispatch(Creators.registerFailure(e));
  }
};

export const editTransaction = (id, type, transaction) => async (dispatch, getState) => {
  dispatch(Creators.editRequest());

  try {
    await axios.put(`api/transactions/${id}`, {
      ...transaction,
      amount: String(transaction.amount),
      executedAt: moment(transaction.executedAt).tz(SERVER_TIMEZONE).format(),
      compensations: transaction.compensations?.map((c) => ({
        ...c,
        id: `api/transactions/${c.id}`,
        amount: String(c.amount),
        executedAt: moment(c.executedAt).tz(SERVER_TIMEZONE).format(),
      })),
    });

    dispatch(Creators.editSuccess());
    notify('success', `Transaction ${id} edited successfully`);

    const { filters } = getState().transaction.pagination;

    if (isOnTransactionsPage() && (filters.hasType(type) || filters.types.length === 0)) {
      dispatch(fetchList());
    }

    dispatch(fetchAccounts());
    dispatch(fetchDebts());
  } catch (e) {
    notify('error', 'Edit Transaction');
    dispatch(Creators.editFailure(e));
  }
};

export const deleteTransaction = (transaction) => async (dispatch, getState) => {
  const { isConfirmed } = await transactionDeletionPrompt(transaction);

  if (!isConfirmed) {
    return;
  }

  dispatch(Creators.deleteRequest());

  try {
    await axios.delete(`api/transactions/${transaction.id}`);

    dispatch(Creators.deleteSuccess(transaction.id));

    notify('success', 'Transaction deleted!', 'DELETED');

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
  } catch (e) {
    notify('error', 'Delete Transaction');
    dispatch(Creators.deleteFailure(e));
  }
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
