import orderBy from 'lodash/orderBy';
import { createActions } from 'reduxsauce';

import axios from 'src/services/http';
import Routing from 'src/services/routing';
import { confirmCategoryRemoval, createCategoriesTree } from 'src/services/transaction';
import { notify } from 'src/store/actions/global';

export const { Types, Creators } = createActions(
  {
    fetchListRequest: null,
    fetchListSuccess: ['categories'],
    fetchListFailure: ['message'],

    fetchTreeRequest: null,
    fetchTreeSuccess: ['categoryType', 'treeData'],
    fetchTreeFailure: ['message'],

    createRequest: null,
    createSuccess: null,
    createFailure: ['message'],

    editRequest: null,
    editSuccess: null,
    editFailure: ['message'],

    removeRequest: null,
    removeSuccess: null,
    removeFailure: ['message'],

    updateTree: ['categoryType', 'treeData'],

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
      notify('error', '[Error]: Fetch Category List');
      dispatch(Creators.fetchListFailure(message));
    });
};

export const fetchTree = (categoryType) => (dispatch) => {
  dispatch(Creators.fetchTreeRequest());

  return axios
    .get(`api/categories/${categoryType}`)
    .then(({ data }) => dispatch(Creators.fetchTreeSuccess(categoryType, createCategoriesTree(data['hydra:member']))))
    .catch(({ message }) => {
      notify('error', '[Error]: Fetch Category Tree');
      dispatch(Creators.fetchTreeFailure(message));
    });
};

export const setParent = (category, parentCategory) => (dispatch) => {
  dispatch(Creators.setParentRequest());

  return axios
    .patch(Routing.generate('api_v1_category_set_parent', { id: category.id }), {
      parentId: parentCategory ? parentCategory.id : null,
    })
    .then(() => {
      dispatch(Creators.setParentSuccess());
      const message = parentCategory
        ? `Category "${category.title}" was nested under "${parentCategory.title}"`
        : `Category "${category.title}" is now at root level`;
      notify('info', message);
    })
    .catch(({ message }) => {
      notify('error', '[Error]: Category Set Parent');
      dispatch(Creators.setParentFailure(message));
    });
};

export const updateTree = (categoryType, treeData) => (dispatch) => dispatch(Creators.updateTree(categoryType, treeData));

export const create = (type, data) => (dispatch) => {
  dispatch(Creators.createRequest());

  return axios
    .post(`api/categories/${type}`, data)
    .then(() => {
      dispatch(Creators.createSuccess());
      notify('success', 'Category successfully created', 'New category');

      dispatch(fetchTree(type));
    })
    .catch(({ message }) => {
      notify('error', '[Error]: Category Create');
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

      dispatch(fetchTree(type));
    })
    .catch(({ message }) => {
      notify('error', '[Error]: Category Edit');
      dispatch(Creators.editFailure(message));
    });
};

export const remove = (category, categoryType, treeData) => (dispatch) => confirmCategoryRemoval(category).then(({ value }) => {
  if (!value) {
    return {};
  }

  dispatch(Creators.removeRequest());

  return axios
    .delete(Routing.generate('api_v1_category_remove', { id: category.id }))
    .then(() => {
      dispatch(Creators.removeSuccess());
      dispatch(updateTree(categoryType, treeData));
      notify('warning', `Category '${category.name}' and it's transactions were removed`);
    })
    .catch(({ message }) => {
      notify('error', '[Error]: Category Delete');
      dispatch(Creators.removeFailure(message));
    });
});
