import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import color from 'randomcolor';
import { createActions } from 'reduxsauce';

import axios from 'src/utils/http';
import { categoryRemovalPrompt } from 'src/utils/prompts';
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

export const fetchList = () => async (dispatch) => {
  dispatch(Creators.fetchListRequest());

  try {
    const response = await axios.get('api/categories');
    const categories = orderBy(
      response.data['hydra:member'],
      'id',
      'asc',
    ).map(({ createdAt, ...cat }) => ({
      ...cat,
      color: cat.color || color({
        luminosity: 'bright',
        seed: cat.name,
      }),
      createdAt: moment(createdAt),
    }));
    dispatch(Creators.fetchListSuccess(categories));
  } catch (e) {
    notify('error', 'Fetch Category List');
    dispatch(Creators.fetchListFailure(e.message));
  }
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
