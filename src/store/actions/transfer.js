import { createActions } from 'reduxsauce';
import Swal from 'sweetalert2';
import moment from 'moment-timezone';

import axios from 'src/services/http';
import { getTransferListQueryParams, isOnDashboardPage, isOnTransfersPage } from 'src/services/routing';
import { updateDashboard } from 'src/store/actions/dashboard';
import { notify } from 'src/store/actions/global';
import { fetchList as fetchAccounts } from 'src/store/actions/account';
import { fetchList as fetchDebts } from 'src/store/actions/debt';
import Pagination from 'src/models/Pagination';
import TransferFilters from 'src/models/TransferFilters';
import { ROUTE_TRANSFERS } from 'src/constants/routes';
import history from 'src/services/history';
import { SERVER_TIMEZONE } from 'src/constants/datetime';

export const { Types, Creators } = createActions(
  {
    fetchListRequest: null,
    fetchListSuccess: ['data', 'count'],
    fetchListFailure: ['message'],

    registerRequest: null,
    registerSuccess: null,
    registerFailure: ['message'],

    deleteRequest: null,
    deleteSuccess: ['transferId'],
    deleteFailure: ['message'],

    setPagination: ['model'],
    setPage: ['page'],
    setPerPage: ['perPage'],
    resetPagination: null,

    setFilters: ['model'],
    resetFilters: null,
  },
  { prefix: 'TRANSFER_' },
);

export const initializeList = () => (dispatch) => {
  const { page, perPage, ...filters } = getTransferListQueryParams(history.location.search);

  dispatch(
    setPagination(
      new Pagination({
        page,
        perPage,
        filters: new TransferFilters(filters),
      }),
    ),
  );
};

export const fetchList = () => async (dispatch, getState) => {
  dispatch(Creators.fetchListRequest());
  let response;

  try {
    const {
      page,
      perPage,
      filters: {
        from,
        to,
      },
    } = getState().transfer.pagination;
    const params = {
      perPage,
      page,
      'executedAt[after]': from,
      'executedAt[before]': to,
    };
    response = await axios.get('api/transfers', { params });
  } catch (e) {
    notify('error', 'Fetch Transfer List');
    dispatch(Creators.fetchListFailure(e));
  } finally {
    dispatch(Creators.fetchListSuccess(response.data['hydra:member'], response.data['hydra:totalItems']));
  }
};

export const registerTransfer = (transfer) => async (dispatch) => {
  dispatch(Creators.registerRequest());

  try {
    await axios.post('api/transfers', {
      ...transfer,
      amount: String(transfer.amount),
      rate: String(transfer.rate),
      fee: String(transfer.fee),
      executedAt: moment(transfer.executedAt).tz(SERVER_TIMEZONE).format(),
    });
  } catch (e) {
    notify('error', 'Register Transfer');
    dispatch(Creators.registerFailure(e));
  } finally {
    dispatch(Creators.registerSuccess());
    notify('success', 'Transfer successfully registered', 'Transaction registered');

    if (isOnDashboardPage()) {
      dispatch(updateDashboard());
    }

    if (isOnTransfersPage()) {
      dispatch(fetchList());
    }

    dispatch(fetchAccounts());
    dispatch(fetchDebts());
  }
};

export const deleteTransfer = ({ id }) => async (dispatch) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Delete transfer',
    text: `Are you sure you want to delete transfer #${id}?`,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-success',
    reverseButtons: true,
    buttonsStyling: false,
  });

  if (!isConfirmed) {
    return;
  }

  dispatch(Creators.deleteRequest());

  try {
    await axios.delete(`api/transfers/${id}`);
  } catch (e) {
    notify('error', 'Delete Transfer');
    dispatch(Creators.deleteFailure(e));
  } finally {
    dispatch(Creators.deleteSuccess(id));
    notify('success', 'Transfer deleted!', 'Deleted');

    if (isOnDashboardPage()) {
      dispatch(updateDashboard());
    }

    if (isOnTransfersPage()) {
      dispatch(fetchList());
    }
  }
};

export const setPagination = (model) => (dispatch, getState) => {
  if (!getState().transfer.pagination.isEqual(model)) {
    dispatch(Creators.setPagination(model));
    history.push(`${ROUTE_TRANSFERS}?${model.getParamsQuery()}`);
  }
};

export const setPage = (page) => (dispatch, getState) => {
  const model = getState().transfer.pagination.merge({
    page,
  });

  if (!getState().transfer.pagination.page !== page) {
    dispatch(Creators.setPage(page));
    history.push(`${ROUTE_TRANSFERS}?${model.getParamsQuery()}`);
  }
};

export const setPerPage = (perPage) => (dispatch, getState) => {
  const model = getState().transfer.pagination.merge({
    perPage,
  });

  if (getState().transfer.pagination.perPage !== perPage) {
    dispatch(Creators.setPerPage(perPage));
    history.push(`${ROUTE_TRANSFERS}?${model.getParamsQuery()}`);
  }
};

export const resetPagination = () => (dispatch) => dispatch(Creators.resetPagination());

export const setFilters = (filters) => (dispatch, getState) => {
  const { pagination } = getState().transfer;
  const model = pagination.merge({
    filters,
  });

  if (!getState().transaction.pagination.isEqual(model)) {
    dispatch(Creators.setFilters(filters));
    history.push(`${ROUTE_TRANSFERS}?${model.getParamsQuery()}`);
  }
};

export const resetFilters = () => (dispatch, getState) => {
  dispatch(Creators.resetFilters());
  const model = getState().transfer.pagination.merge({
    filters: new TransferFilters(),
  });
  history.push(`${ROUTE_TRANSFERS}?${model.getParamsQuery()}`);
};
