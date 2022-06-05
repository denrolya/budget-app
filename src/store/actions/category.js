import orderBy from 'lodash/orderBy';
import { createActions } from 'reduxsauce';

import axios from 'src/services/http';
import { categoryRemovalPrompt } from 'src/services/prompts';
import { notify } from 'src/store/actions/global';

export const { Types, Creators } = createActions(
  {
    fetchListRequest: null,
    fetchListSuccess: ['categories'],
    fetchListFailure: ['message'],

    createRequest: null,
    createSuccess: null,
    createFailure: ['message'],

    editRequest: null,
    editSuccess: null,
    editFailure: ['message'],

    removeRequest: null,
    removeSuccess: null,
    removeFailure: ['message'],

    setParentRequest: null,
    setParentSuccess: null,
    setParentFailure: ['message'],
  },
  { prefix: 'CATEGORY_' },
);

export const fetchList = () => (dispatch) => {
  dispatch(Creators.fetchListRequest());

  return axios
    .get('api/categories')
    .then(({ data }) => dispatch(Creators.fetchListSuccess(orderBy(data['hydra:member'], 'id', 'asc'))))
    .catch(({ message }) => {
      notify('error', 'Fetch Category List');
      dispatch(Creators.fetchListFailure(message));
    });
};

export const setParent = (category, parentCategory) => (dispatch) => {
  dispatch(Creators.setParentRequest());

  return axios
    .put(`api/categories/${category.id}`, {
      parent: parentCategory?.id || null,
    })
    .then(() => {
      dispatch(Creators.setParentSuccess());
      const message = parentCategory
        ? `Category "${category.name}" was nested under "${parentCategory.name}"`
        : `Category "${category.name}" is now at root level`;
      notify('info', message);
    })
    .catch(({ message }) => {
      notify('error', 'Category Set Parent');
      dispatch(Creators.setParentFailure(message));
    });
};

export const create = (type, data) => (dispatch) => {
  dispatch(Creators.createRequest());

  return axios
    .post(`api/categories/${type}`, data)
    .then(() => {
      dispatch(Creators.createSuccess());
      notify('success', 'Category successfully created', 'New category');
    })
    .catch(({ message }) => {
      notify('error', 'Category Create');
      dispatch(Creators.createFailure(message));
    });
};

export const edit = (id, type, data) => (dispatch) => {
  dispatch(Creators.editRequest());

  return axios
    .put(`api/categories/${id}`, data)
    .then(() => {
      dispatch(Creators.editSuccess());
      notify('success', 'Category was successfully updated.', 'Edited successfully');
    })
    .catch(({ message }) => {
      notify('error', 'Category Edit');
      dispatch(Creators.editFailure(message));
    });
};

export const remove = (category) => async (dispatch) => {
  const { isConfirmed } = await categoryRemovalPrompt(category);

  if (!isConfirmed) {
    return {};
  }

  dispatch(Creators.removeRequest());

  return axios
    .delete(`api/categories/${category.id}`)
    .then(() => {
      dispatch(Creators.removeSuccess());
      notify('warning', `Category '${category.name}' and it's transactions were removed`);
    })
    .catch(({ message }) => {
      notify('error', 'Category Delete');
      dispatch(Creators.removeFailure(message));
    });
};
