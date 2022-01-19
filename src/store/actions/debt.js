import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import { createActions } from 'reduxsauce';
import { SERVER_TIMEZONE } from 'src/constants/datetime';
import Swal from 'sweetalert2';

import { ROUTE_DASHBOARD, ROUTE_DEBTS } from 'src/constants/routes';
import axios from 'src/services/http';
import Routing, { isOnPath } from 'src/services/routing';
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

export const fetchList = () => (dispatch) => {
  dispatch(Creators.fetchListRequest());

  return axios
    .get('api/debts')
    .then(({ data }) => {
      dispatch(Creators.fetchListSuccess(orderBy(data['hydra:member'], 'updatedAt', 'asc')));
    })
    .catch((e) => {
      notify('error', '[Error]: Fetch Debt List');
      dispatch(Creators.fetchListFailure(e.message));
    });
};

export const createDebt = (debt) => (dispatch) => {
  dispatch(Creators.createRequest());

  return axios
    .post('api/debts', {
      ...debt,
      balance: String(debt.balance),
      createdAt: moment(debt.createdAt).tz(SERVER_TIMEZONE).format(),
      closedAt: debt.closedAt ? moment(debt.createdAt).tz(SERVER_TIMEZONE).format() : undefined,
    })
    .then(({ data }) => {
      dispatch(Creators.createSuccess(data));

      if (isOnPath(ROUTE_DEBTS)) {
        dispatch(fetchList());
      }

      if (isOnPath(ROUTE_DASHBOARD)) {
        dispatch(updateDashboard());
      }
    })
    .catch((e) => {
      notify('error', '[Error]: Create Debt');
      dispatch(Creators.createFailure(e.message));
    });
};

export const editDebt = (id, debt) => (dispatch) => {
  dispatch(Creators.editRequest());

  return axios.put(`api/debts/${id}`, {
    ...debt,
    balance: String(debt.balance),
    createdAt: moment(debt.createdAt).tz(SERVER_TIMEZONE).format(),
    closedAt: debt.closedAt ? moment(debt.createdAt).tz(SERVER_TIMEZONE).format() : undefined,
  })
    .then(({ data }) => {
      dispatch(Creators.editSuccess(data));

      if (isOnPath(ROUTE_DEBTS)) {
        dispatch(fetchList());
      }
    })
    .catch((e) => {
      notify('error', '[Error]: Edit Debt');
      dispatch(Creators.editFailure(e.message));
    });
};

export const closeDebt = ({
  id, debtor, currency, balance,
}) => (dispatch) => Swal.fire({
  title: 'Close this debt',
  text: `Are you sure you want to close ${debtor}'s debt?(${currency.symbol} ${balance})`,
  showCancelButton: true,
  confirmButtonText: 'Yes, close this debt!',
  cancelButtonText: 'No, keep it',
  confirmButtonClass: 'btn btn-danger',
  cancelButtonClass: 'btn btn-success',
  reverseButtons: false,
  buttonsStyling: false,
}).then(({ value }) => {
  if (!value) {
    return {};
  }
  dispatch(Creators.deleteDebtRequest());

  return axios
    .delete(Routing.generate('api_v1_debt_delete', { id }))
    .then(() => {
      dispatch(Creators.deleteDebtSuccess({ id }));
      notify('success', 'Debt successfully closed!', 'Closed');

      if (isOnPath(ROUTE_DEBTS)) {
        dispatch(fetchList());
      }
    })
    .catch((e) => {
      notify('error', '[Error]: Close Debt');
      dispatch(Creators.deleteDebtFailure(e.message));
    });
});
