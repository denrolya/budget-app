import { SERVER_TIMEZONE } from 'src/constants/datetime';
import { formatDetails } from 'src/utils/account';
import { generateConvertedValues } from 'src/utils/currency';
import axios from 'src/utils/http';
import orderBy from 'lodash/orderBy';
import { createActions } from 'reduxsauce';
import moment from 'moment-timezone';

import { isOnDashboardPage } from 'src/utils/routing';
import { notify } from 'src/store/actions/global';

export const { Types, Creators } = createActions(
  {
    createRequest: null,
    createSuccess: null,
    createFailure: ['message'],

    editRequest: null,
    editSuccess: ['account'],
    editFailure: ['message'],

    fetchListRequest: null,
    fetchListSuccess: ['list'],
    fetchListFailure: ['message'],

    fetchItemRequest: null,
    fetchItemSuccess: null,
    fetchItemFailure: ['message'],

    archiveRequest: null,
    archiveSuccess: null,
    archiveFailure: ['message'],

    setMonobankHookRequest: null,
    setMonobankHookSuccess: null,
    setMonobankHookFailure: ['message'],
  },
  { prefix: 'ACCOUNT_' },
);

export const fetchList = () => async (dispatch, getState) => {
  let result = [];
  const { exchangeRates } = getState();
  dispatch(Creators.fetchListRequest());

  try {
    const { data } = await axios.get('api/v2/account');
    const accounts = orderBy(
      data,
      ['archivedAt', 'lastTransactionAt'],
      ['desc', 'desc'],
    ).map((account) => ({
      ...account,
      convertedValues: generateConvertedValues(exchangeRates, account.currency, account.balance),
    }));
    dispatch(Creators.fetchListSuccess(accounts));
    result = accounts;
  } catch (e) {
    notify('error', 'Account Fetch List');
    dispatch(Creators.fetchListFailure(e.message));
  }

  return result;
};

export const createAccount = (data) => async (dispatch) => {
  dispatch(Creators.createRequest());

  try {
    await axios.post('api/accounts', data);
    dispatch(Creators.createSuccess());
    notify('success', 'Account created!', 'New account');

    if (isOnDashboardPage()) {
      dispatch(fetchList());
    }
  } catch (e) {
    notify('error', 'Account Create');
    dispatch(Creators.createFailure(e));
  }
};

export const updateName = (account, newName) => async (dispatch) => {
  dispatch(Creators.editRequest());

  try {
    await axios.put(`api/accounts/${account.id}`, {
      name: newName,
    });
    dispatch(Creators.editSuccess({
      ...account,
      name: newName,
    }));
    notify('success', 'New name saved!');
  } catch (e) {
    notify('error', 'Account Edit');
    dispatch(Creators.editFailure(e));
  }
};

export const updateColor = (account, newColor) => async (dispatch) => {
  dispatch(Creators.editRequest());

  try {
    await axios.put(`api/accounts/${account.id}`, {
      color: newColor,
    });
    dispatch(Creators.editSuccess({
      ...account,
      color: newColor,
    }));
    notify('success', 'Color changed!');
  } catch (e) {
    notify('error', 'Account Edit');
    dispatch(Creators.editFailure(e));
  }
};

export const fetchItem = (id) => async (dispatch, getState) => {
  dispatch(Creators.fetchItemRequest());
  try {
    const { data } = await axios.get(`api/v2/account/${id}`);

    dispatch(Creators.fetchItemSuccess());

    return formatDetails(data, getState().auth.user.baseCurrency);
  } catch (e) {
    notify('error', 'Account Fetch Details');
    dispatch(Creators.fetchItemFailure(e));
    return e;
  }
};

export const toggleArchived = (id, isArchived = false) => async (dispatch) => {
  dispatch(Creators.archiveRequest());

  try {
    await axios.put(`api/accounts/${id}`, {
      archivedAt: isArchived ? null : moment().tz(SERVER_TIMEZONE).format(),
    });
    notify('success', 'Account was archived/restored');
    dispatch(Creators.archiveSuccess());
  } catch (e) {
    notify('error', 'Account Edit');
    dispatch(Creators.archiveFailure(e));
  }
};

export const setMonobankHook = () => async (dispatch) => {
  dispatch(Creators.setMonobankHookRequest());

  try {
    await axios.get('/api/v2/account/set-monobank-hook');
    notify('success', 'Webhook was successfully set');
    dispatch(Creators.setMonobankHookSuccess());
  } catch (e) {
    notify('error', 'Error setting monobank webhook');
    dispatch(Creators.setMonobankHookFailure(e));
  }
};
