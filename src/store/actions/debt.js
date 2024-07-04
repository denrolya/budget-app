import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import { createActions } from 'reduxsauce';

import { SERVER_TIMEZONE } from 'src/constants/datetime';
import { closeDebtPrompt } from 'src/utils/prompts';
import { ROUTE_DASHBOARD, ROUTE_DEBTS } from 'src/constants/routes';
import axios from 'src/utils/http';
import { isOnPath } from 'src/utils/routing';
import { updateStatistics } from 'src/store/actions/ui';
import { notify } from 'src/store/actions/global';
import Transaction from 'src/models/Transaction';

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

export const fetchList = () => async (dispatch, getState) => {
  dispatch(Creators.fetchListRequest());

  try {
    let { data } = await axios.get('api/v2/debt');

    const { account, category } = getState();
    data = data.map((d) => ({
      ...d,
      transactions: d.transactions.map((t) => new Transaction(t, account.list, category.list)),
    }));
    dispatch(Creators.fetchListSuccess(
      orderBy(data, 'updatedAt', 'asc'),
    ));
  } catch (e) {
    notify('error', 'Fetch Debt List');
    dispatch(Creators.fetchListFailure(e));
  }
};

export const createDebt = (debt) => async (dispatch, getState) => {
  dispatch(Creators.createRequest());

  try {
    const { account, category } = getState();
    const { data } = await axios.post('api/debts', {
      ...debt,
      balance: String(debt.balance),
      createdAt: moment(debt.createdAt).tz(SERVER_TIMEZONE).format(),
      closedAt: debt.closedAt ? moment(debt.createdAt).tz(SERVER_TIMEZONE).format() : undefined,
      transactions: debt.transactions.map((t) => new Transaction(t, account.list, category.list)),
    });
    dispatch(Creators.createSuccess(data));

    if (isOnPath(ROUTE_DEBTS)) {
      dispatch(fetchList());
    }

    if (isOnPath(ROUTE_DASHBOARD)) {
      dispatch(updateStatistics());
    }
  } catch (e) {
    notify('error', 'Create Debt');
    dispatch(Creators.createFailure(e));
  }
};

export const editDebt = (id, debt) => async (dispatch, getState) => {
  dispatch(Creators.editRequest());

  try {
    const { account, category } = getState();
    const { data } = await axios.put(`api/debts/${id}`, {
      ...debt,
      balance: String(debt.balance),
      createdAt: moment(debt.createdAt).tz(SERVER_TIMEZONE).format(),
      closedAt: debt.closedAt ? moment(debt.createdAt).tz(SERVER_TIMEZONE).format() : undefined,
      transactions: debt.transactions.map((t) => new Transaction(t, account.list, category.list)),
    });

    dispatch(Creators.editSuccess(data));

    if (isOnPath(`/${ROUTE_DEBTS}`)) {
      dispatch(fetchList());
    }
  } catch (e) {
    notify('error', 'Edit Debt');
    dispatch(Creators.editFailure(e));
  }
};

export const closeDebt = ({
  id, debtor, currency, balance,
}) => async (dispatch) => {
  const { isConfirmed } = await closeDebtPrompt(debtor, currency, balance);

  if (!isConfirmed) {
    return;
  }

  dispatch(Creators.deleteDebtRequest());

  try {
    await axios.delete(`api/debts/${id}`);

    dispatch(Creators.deleteDebtSuccess({ id }));
    notify('success', 'Debt successfully closed!', 'Closed');

    if (isOnPath(ROUTE_DEBTS)) {
      dispatch(fetchList());
    }
  } catch (e) {
    notify('error', 'Close Debt');
    dispatch(Creators.deleteDebtFailure(e));
  }
};
