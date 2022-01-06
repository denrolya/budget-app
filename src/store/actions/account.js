import axios from 'src/services/http';
import orderBy from 'lodash/orderBy';
import { createActions } from 'reduxsauce';

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
    .then(({ data }) => dispatch(Creators.fetchListSuccess(orderBy(data, 'lastTransactionAt', 'desc'))))
    .catch((e) => {
      console.error(e);
      dispatch(Creators.fetchListFailure(e.message));
    });
};

export const createAccount = (account) => (dispatch) => {
  dispatch(Creators.createRequest());

  return axios
    .post(Routing.generate('api_v1_account_save'), { account })
    .then(() => {
      dispatch(Creators.createSuccess());
      notify('success', 'Account created!', 'New account');

      if (isOnDashboardPage()) {
        dispatch(fetchList());
      }
    })
    .catch((e) => {
      console.error(e);
      dispatch(Creators.createFailure(e.message));
    });
};

export const updateName = (account, newName) => (dispatch) => {
  dispatch(Creators.editRequest());

  return axios
    .patch(Routing.generate('api_v1_account_edit', { id: account.id }), {
      account: {
        name: newName,
      },
    })
    .then(() => {
      dispatch(
        Creators.editSuccess({
          ...account,
          name: newName,
        }),
      );
      notify('success', 'New name saved!');
    })
    .catch((e) => {
      console.error(e);
      dispatch(Creators.editFailure(e.message));
    });
};

export const updateColor = (account, newColor) => (dispatch) => {
  dispatch(Creators.editRequest());

  return axios
    .patch(Routing.generate('api_v1_account_edit', { id: account.id }), {
      account: {
        color: newColor,
      },
    })
    .then(() => {
      dispatch(
        Creators.editSuccess({
          ...account,
          color: newColor,
        }),
      );
      notify('success', 'Color changed!');
    })
    .catch((e) => {
      console.error(e);
      dispatch(Creators.editFailure(e.message));
    });
};

export const fetchDetail = (id) => axios.get(Routing.generate('api_v1_account_detail', { id }));

export const fetchTypeaheadList = () => axios
  .get(Routing.generate('api_v1_account_typeahead_list'))
  .then(({ data }) => data)
  .catch((e) => console.error(e));

export const toggleArchived = (id) => (dispatch) => {
  dispatch(Creators.archiveRequest());

  return axios
    .delete(Routing.generate('api_v1_account_archive', { id }))
    .then(() => {
      dispatch(Creators.archiveSuccess());
      notify('success', 'Account was archived/restored');
    })
    .catch((e) => {
      console.error(e);
      dispatch(Creators.archiveFailure(e.message));
    });
};
