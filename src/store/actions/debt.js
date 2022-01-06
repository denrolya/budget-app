import axios from 'src/services/http';
import orderBy from 'lodash/orderBy';
import { createActions } from 'reduxsauce';
import Swal from 'sweetalert2';
import moment from 'moment-timezone';

import { ROUTE_DASHBOARD, ROUTE_DEBTS } from 'src/constants/routes';
import Routing, { isOnPath } from 'src/services/routing';
import { confirmTransactionDeletion } from 'src/services/transaction';
import { updateDashboard } from 'src/store/actions/dashboard';
import { notify } from 'src/store/actions/global';
import { fetchList as fetchAccounts } from 'src/store/actions/account';
import { SERVER_TIMEZONE } from 'src/constants/datetime';

export const { Types, Creators } = createActions(
  {
    createRequest: null,
    createSuccess: null,
    createFailure: ['message'],

    editRequest: null,
    editSuccess: null,
    editFailure: ['message'],

    registerDebtTransactionRequest: null,
    registerDebtTransactionSuccess: null,
    registerDebtTransactionFailure: ['message'],

    editDebtTransactionRequest: null,
    editDebtTransactionSuccess: null,
    editDebtTransactionFailure: ['message'],

    deleteDebtRequest: null,
    deleteDebtSuccess: ['debt'],
    deleteDebtFailure: ['message'],

    fetchListRequest: null,
    fetchListSuccess: ['debts'],
    fetchListFailure: ['message'],

    fetchTransactionsListRequest: null,
    fetchTransactionsListSuccess: ['transactions'],
    fetchTransactionsListFailure: ['message'],

    deleteTransactionRequest: null,
    deleteTransactionSuccess: null,
    deleteTransactionFailure: ['message'],

    toggleWithClosedFilter: null,
  },
  { prefix: 'DEBT_' },
);

export const fetchList = () => (dispatch, getState) => {
  dispatch(Creators.fetchListRequest());

  return axios
    .get('api/debts', {
      withDeleted: getState().debt.withClosed ? 1 : 0,
    })
    .then((response) => {
      dispatch(Creators.fetchListSuccess(orderBy(response.data, 'updated_at', 'asc')));
    })
    .catch((e) => {
      console.error(e);
      dispatch(Creators.fetchListFailure(e.message));
    });
};

export const createDebt = (debt) => (dispatch) => {
  dispatch(Creators.createRequest());

  return axios
    .post(Routing.generate('api_v1_debt_save'), { debt })
    .then(() => {
      dispatch(Creators.createSuccess());

      if (isOnPath(ROUTE_DEBTS)) {
        dispatch(fetchList());
      }

      if (isOnPath(ROUTE_DASHBOARD)) {
        dispatch(updateDashboard());
      }
    })
    .catch((e) => {
      console.log(e);
      dispatch(Creators.createFailure(e.message));
    });
};

export const editDebt = (id, debt) => (dispatch) => {
  dispatch(Creators.editRequest());

  return axios.put(Routing.generate('api_v1_debt_edit', { id }), { debt }).then(() => {
    dispatch(Creators.editSuccess());

    if (isOnPath(ROUTE_DEBTS)) {
      dispatch(fetchList());
    }
  });
};

export const fetchTransactionsList = (id) => (dispatch) => {
  dispatch(Creators.fetchTransactionsListRequest());

  return axios
    .get(Routing.generate('api_v1_debt_transaction_list', { id }))
    .then((response) => {
      const transactionsOrdered = orderBy(response.data, 'createdAt', 'asc');
      dispatch(Creators.fetchTransactionsListSuccess(transactionsOrdered));
      return transactionsOrdered;
    })
    .catch((e) => {
      console.error(e);
      dispatch(Creators.fetchTransactionsListFailure(e.message));
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
      console.error(e);
      dispatch(Creators.deleteDebtFailure(e.message));
    });
});

export const registerDebtTransaction = (debtId, type, transaction, shouldCloseDebt) => (dispatch) => {
  dispatch(Creators.registerDebtTransactionRequest());

  return axios
    .post(
      Routing.generate('api_v1_debt_transaction_new', {
        type,
        id: debtId,
      }),
      {
        shouldCloseDebt,
        [type]: {
          ...transaction,
          executedAt: moment(transaction.executedAt).tz(SERVER_TIMEZONE).format(),
        },
      },
    )
    .then(() => {
      dispatch(Creators.registerDebtTransactionSuccess());
      notify('success', 'New debt transaction was successfully created.', 'Transaction registered!');

      dispatch(fetchAccounts());
      dispatch(fetchList());
    })
    .catch((e) => {
      console.error(e);
      dispatch(Creators.registerDebtTransactionFailure(e.message));
    });
};

export const editDebtTransaction = (debt, transaction) => (dispatch) => {
  dispatch(Creators.editDebtTransactionRequest());

  return axios
    .put(
      Routing.generate('api_v1_debt_transaction_edit', {
        id: debt.id,
        transactionId: transaction.id,
      }),
      { [transaction.type]: transaction },
    )
    .then(() => {
      dispatch(Creators.editDebtTransactionSuccess());
      notify('success', 'Given transaction was successfully modified.', 'Edited successfully');

      if (isOnPath(ROUTE_DEBTS)) {
        dispatch(fetchList());
      }
    })
    .catch((e) => {
      console.error(e);
      dispatch(Creators.editDebtTransactionFailure(e.message));
    });
};

export const deleteDebtTransaction = (debt, transaction) => (dispatch) => confirmTransactionDeletion(transaction).then(({ value }) => {
  if (!value) {
    return {};
  }

  dispatch(Creators.deleteTransactionRequest());

  return axios
    .delete(
      Routing.generate('api_v1_debt_transaction_delete', {
        id: debt.id,
        transactionId: transaction.id,
      }),
    )
    .then(() => {
      dispatch(Creators.deleteTransactionSuccess(transaction.id));
      notify('success', 'Transaction deleted!', 'Deleted');

      if (isOnPath(ROUTE_DEBTS)) {
        dispatch(fetchList());
      }
    })
    .catch((e) => {
      console.error(e);
      dispatch(Creators.deleteTransactionFailure(e.message));
    });
});

export const toggleWithClosedFilter = () => (dispatch) => {
  dispatch(Creators.toggleWithClosedFilter());

  dispatch(fetchList());
};
