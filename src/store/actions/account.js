import { SERVER_TIMEZONE } from 'src/constants/datetime';
import axios from 'src/services/http';
import orderBy from 'lodash/orderBy';
import { createActions } from 'reduxsauce';
import moment from 'moment-timezone';

import Routing, { isOnDashboardPage } from 'src/services/routing';
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

    archiveRequest: null,
    archiveSuccess: null,
    archiveFailure: ['message'],
  },
  { prefix: 'ACCOUNT_' },
);

export const fetchList = () => (dispatch) => {
  dispatch(Creators.fetchListRequest());

  return axios
    .get('api/accounts')
    .then(({ data }) => dispatch(Creators.fetchListSuccess(orderBy(data['hydra:member'], ['archivedAt', 'lastTransactionAt'], ['desc', 'desc']))))
    .catch((e) => {
      notify('error', '[Error]: Account Fetch List');
      dispatch(Creators.fetchListFailure(e.message));
    });
};

export const createAccount = (data) => (dispatch) => {
  dispatch(Creators.createRequest());

  return axios
    .post('api/accounts', data)
    .then(() => {
      dispatch(Creators.createSuccess());
      notify('success', 'Account created!', 'New account');

      if (isOnDashboardPage()) {
        dispatch(fetchList());
      }
    })
    .catch((e) => {
      notify('error', '[Error]: Account Create');
      dispatch(Creators.createFailure(e.message));
    });
};

export const updateName = (account, newName) => (dispatch) => {
  dispatch(Creators.editRequest());

  return axios.put(`api/accounts/${account.id}`, {
    name: newName,
  }).then(() => {
    dispatch(
      Creators.editSuccess({
        ...account,
        name: newName,
      }),
    );
    notify('success', 'New name saved!');
  }).catch((e) => {
    notify('error', '[Error]: Account Edit');
    dispatch(Creators.editFailure(e.message));
  });
};

export const updateColor = (account, newColor) => (dispatch) => {
  dispatch(Creators.editRequest());

  return axios.put(`api/accounts/${account.id}`, {
    color: newColor,
  }).then(() => {
    dispatch(
      Creators.editSuccess({
        ...account,
        color: newColor,
      }),
    );
    notify('success', 'Color changed!');
  }).catch((e) => {
    notify('error', '[Error]: Account Edit');
    dispatch(Creators.editFailure(e.message));
  });
};

export const fetchDetail = (id) => axios.get(`api/accounts/${id}`);

export const toggleArchived = (id, isArchived = false) => (dispatch) => {
  dispatch(Creators.archiveRequest());

  return axios.put(`api/accounts/${id}`, {
    archivedAt: isArchived ? null : moment().tz(SERVER_TIMEZONE).format(),
  }).then(() => {
    notify('success', 'Account was archived/restored');
    dispatch(Creators.archiveSuccess());
  }).catch((e) => {
    notify('error', '[Error]: Account Edit');
    dispatch(Creators.archiveFailure(e.message));
  });
};
