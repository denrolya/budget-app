import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import { createActions } from 'reduxsauce';
import { SERVER_TIMEZONE } from 'src/constants/datetime';
import Swal from 'sweetalert2';

import { ROUTE_DASHBOARD, ROUTE_DEBTS } from 'src/constants/routes';
import axios from 'src/services/http';
import { isOnPath } from 'src/services/routing';
import { updateDashboard } from 'src/store/actions/dashboard';
import { notify } from 'src/store/actions/global';

export const { Types, Creators } = createActions(
  {
    fetchListRequest: null,
    fetchListSuccess: ['debts'],
    fetchListFailure: ['message'],

    createRequest: null,
    createSuccess: ['debt'],
    createFailure: ['message'],

    editRequest: null,
    editSuccess: ['debt'],
    editFailure: ['message'],

    deleteDebtRequest: null,
    deleteDebtSuccess: ['debt'],
    deleteDebtFailure: ['message'],
  },
  { prefix: 'DEBT_' },
);

export const fetchList = () => async (dispatch) => {
  dispatch(Creators.fetchListRequest());
  let response;

  try {
    response = await axios.get('api/debts');
  } catch (e) {
    notify('error', 'Fetch Debt List');
    dispatch(Creators.fetchListFailure(e));
  } finally {
    dispatch(Creators.fetchListSuccess(orderBy(response.data['hydra:member'], 'updatedAt', 'asc')));
  }
};

export const createDebt = (debt) => async (dispatch) => {
  dispatch(Creators.createRequest());
  let response;

  try {
    response = await axios.post('api/debts', {
      ...debt,
      balance: String(debt.balance),
      createdAt: moment(debt.createdAt).tz(SERVER_TIMEZONE).format(),
      closedAt: debt.closedAt ? moment(debt.createdAt).tz(SERVER_TIMEZONE).format() : undefined,
    });
  } catch (e) {
    notify('error', 'Create Debt');
    dispatch(Creators.createFailure(e));
  } finally {
    dispatch(Creators.createSuccess(response.data));

    if (isOnPath(ROUTE_DEBTS)) {
      dispatch(fetchList());
    }

    if (isOnPath(ROUTE_DASHBOARD)) {
      dispatch(updateDashboard());
    }
  }
};

export const editDebt = (id, debt) => async (dispatch) => {
  dispatch(Creators.editRequest());
  let response;

  try {
    response = await axios.put(`api/debts/${id}`, {
      ...debt,
      balance: String(debt.balance),
      createdAt: moment(debt.createdAt).tz(SERVER_TIMEZONE).format(),
      closedAt: debt.closedAt ? moment(debt.createdAt).tz(SERVER_TIMEZONE).format() : undefined,
    });
  } catch (e) {
    notify('error', 'Edit Debt');
    dispatch(Creators.editFailure(e));
  } finally {
    dispatch(Creators.editSuccess(response.data));

    if (isOnPath(ROUTE_DEBTS)) {
      dispatch(fetchList());
    }
  }
};

export const closeDebt = ({
  id, debtor, currency, balance,
}) => async (dispatch) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Close this debt',
    text: `Are you sure you want to close ${debtor}'s debt?(${currency.symbol} ${balance})`,
    showCancelButton: true,
    confirmButtonText: 'Yes, close this debt!',
    cancelButtonText: 'No, keep it',
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-success',
    reverseButtons: false,
    buttonsStyling: false,
  });

  if (!isConfirmed) {
    return;
  }
  dispatch(Creators.deleteDebtRequest());

  try {
    await axios.delete(`api/debts/${id}`);
  } catch (e) {
    notify('error', 'Close Debt');
    dispatch(Creators.deleteDebtFailure(e));
  } finally {
    dispatch(Creators.deleteDebtSuccess({ id }));
    notify('success', 'Debt successfully closed!', 'Closed');

    if (isOnPath(ROUTE_DEBTS)) {
      dispatch(fetchList());
    }
  }
};
