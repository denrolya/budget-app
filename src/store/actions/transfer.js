import axios from 'src/services/http';
import { createActions } from 'reduxsauce';
import Swal from 'sweetalert2';

import Routing, { getTransferListQueryParams, isOnDashboardPage, isOnTransfersPage } from 'src/services/routing';
import { updateDashboard } from 'src/store/actions/dashboard';
import { notify } from 'src/store/actions/global';
import { fetchList as fetchAccounts } from 'src/store/actions/account';
import { fetchList as fetchDebts } from 'src/store/actions/debt';
import Pagination from 'src/models/Pagination';
import TransferFilters from 'src/models/TransferFilters';
import { ROUTE_TRANSFERS } from 'src/constants/routes';
import history from 'src/services/history';

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

export const fetchList = () => (dispatch, getState) => {
  const {
    page,
    perPage,
    filters: { from, to },
  } = getState().transfer.pagination;

  dispatch(Creators.fetchListRequest());

  const queryParams = {
    perPage,
    page,
    from,
    to,
  };

  return axios
    .get(Routing.generate('api_v1_transfer_list', queryParams))
    .then(({ data }) => {
      const { list, count } = data;

      dispatch(Creators.fetchListSuccess(list, count));
    })
    .catch(({ message }) => dispatch(Creators.fetchListFailure(message)));
};

export const registerTransfer = (transfer) => (dispatch) => {
  dispatch(Creators.registerRequest());

  return axios
    .post(Routing.generate('api_v1_transfer_save'), { transfer })
    .then(() => {
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
    })
    .catch(({ message }) => dispatch(Creators.registerFailure(message)));
};

export const deleteTransfer = ({ id }) => (dispatch) =>
  Swal.fire({
    title: 'Delete transfer',
    text: `Are you sure you want to delete transfer #${id}?`,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-success',
    reverseButtons: true,
    buttonsStyling: false,
  }).then(({ value }) => {
    if (!value) {
      return;
    }

    dispatch(Creators.deleteRequest());

    return axios
      .delete(Routing.generate('api_v1_transfer_delete', { id }))
      .then(() => {
        dispatch(Creators.deleteSuccess(id));
        notify('success', 'Transfer deleted!', 'Deleted');

        if (isOnDashboardPage()) {
          dispatch(updateDashboard());
        }

        if (isOnTransfersPage()) {
          dispatch(fetchList());
        }
      })
      .catch(({ message }) => dispatch(Creators.deleteFailure(message)));
  });

export const setPagination = (model) => (dispatch) => {
  dispatch(Creators.setPagination(model));
  history.push(`${ROUTE_TRANSFERS}?${model.getParamsQuery()}`);
};

export const setPage = (page) => (dispatch, getState) => {
  dispatch(Creators.setPage(page));
  const model = getState().transfer.pagination.merge({
    page,
  });
  history.push(`${ROUTE_TRANSFERS}?${model.getParamsQuery()}`);
};

export const setPerPage = (perPage) => (dispatch, getState) => {
  dispatch(Creators.setPerPage(perPage));
  const model = getState().transfer.pagination.merge({
    perPage,
  });
  history.push(`${ROUTE_TRANSFERS}?${model.getParamsQuery()}`);
};

export const resetPagination = () => (dispatch) => dispatch(Creators.resetPagination());

export const setFilters = (filters) => (dispatch, getState) => {
  const { pagination } = getState().transfer;
  dispatch(Creators.setFilters(filters));
  const model = pagination.merge({
    filters,
  });
  history.push(`${ROUTE_TRANSFERS}?${model.getParamsQuery()}`);
};

export const resetFilters = () => (dispatch, getState) => {
  dispatch(Creators.resetFilters());
  const model = getState().transfer.pagination.merge({
    filters: new TransferFilters(),
  });
  history.push(`${ROUTE_TRANSFERS}?${model.getParamsQuery()}`);
};
