import axios from 'src/services/http';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import { createActions } from 'reduxsauce';

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

export const fetchCategories = (type) => axios
  .get(type ? `api/categories/${type}` : 'api/categories')
  .then((response) => uniqBy(response.data, 'name'));

export const fetchList = (types) => (dispatch) => {
  dispatch(Creators.fetchListRequest());

  return axios
    .get(Routing.generate('api_v1_category_list', { types }))
    .then(({ data }) => dispatch(Creators.fetchListSuccess(orderBy(data, 'id', 'asc'))))
    .catch(({ message }) => {
      dispatch(Creators.fetchListFailure(message));
      console.error('Error: ', message);
    });
};

export const fetchTree = (categoryType) => (dispatch) => {
  dispatch(Creators.fetchTreeRequest());

  return axios
    .get(Routing.generate(`api_v1_${categoryType}_category_tree`))
    .then(({ data }) => dispatch(Creators.fetchTreeSuccess(categoryType, createCategoriesTree(data))))
    .catch(({ message }) => {
      dispatch(Creators.fetchTreeFailure(message));
      console.error('Error: ', message);
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
      dispatch(Creators.setParentFailure(message));
      console.error('Error: ', message);
    });
};

export const updateTree = (categoryType, treeData) => (dispatch) => dispatch(Creators.updateTree(categoryType, treeData));

export const create = (type, category) => (dispatch) => {
  dispatch(Creators.createRequest());

  return axios
    .post(Routing.generate('api_v1_category_new', { type }), {
      [`${type}_category`]: category,
    })
    .then(() => {
      dispatch(Creators.createSuccess());
      notify('success', 'Category successfully created', 'New category');

      dispatch(fetchTree(type));
    })
    .catch(({ message }) => dispatch(Creators.createFailure(message)));
};

export const edit = (id, type, category) => (dispatch) => {
  dispatch(Creators.editRequest());

  return axios
    .put(Routing.generate('api_v1_category_edit', { id }), {
      [`${type}_category`]: category,
    })
    .then(() => {
      dispatch(Creators.editSuccess());
      notify('success', 'Category was successfully updated.', 'Edited successfully');

      dispatch(fetchTree(type));
    })
    .catch(({ message }) => dispatch(Creators.editFailure(message)));
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
      dispatch(Creators.removeFailure(message));
      console.error('Error: ', message);
    });
});
