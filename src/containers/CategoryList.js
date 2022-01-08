import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import {
  Button, CardBody, Col, Row,
} from 'reactstrap';
import SortableTree, { removeNodeAtPath } from 'react-sortable-tree';

import AddNewButton from 'src/components/AddNewButton';
import CategoryForm from 'src/components/forms/CategoryForm';
import ModalForm from 'src/components/forms/ModalForm';
import { EXPENSE_TYPE, INCOME_TYPE, TRANSACTION_TYPES } from 'src/constants/transactions';
import { isActionLoading } from 'src/services/common';
import {
  create, edit, fetchTree, remove, setParent, updateTree,
} from 'src/store/actions/category';
import LoadingCard from 'src/components/cards/LoadingCard';

import 'react-sortable-tree/style.css';

const CategoryList = ({
  fetchTree,
  setParent,
  tree,
  isSavingCategory,
  updateTree,
  create,
  edit,
  remove,
  isLoading,
}) => {
  const [selectedCategory, selectCategory] = useState();
  const [isFormOpened, setIsFormOpened] = useState(false);
  const toggleForm = () => setIsFormOpened(!isFormOpened);
  const toggleCategoryEdition = (category) => {
    selectCategory(category);
    toggleForm();
  };
  const handleCategorySubmit = (category) => {
    selectCategory();
    return category.id ? edit(category.id, category.type, category) : create(category.type, category);
  };

  useEffect(() => {
    fetchTree(EXPENSE_TYPE);
    fetchTree(INCOME_TYPE);
  }, []);

  const reorderNodes = ({
    node, nextParentNode, prevPath, nextPath,
  }) => {
    if (isEqual(prevPath, nextPath)) {
      return;
    }

    setParent(node, nextParentNode);
  };

  return (
    <>
      <Helmet>
        <title>
          Categories | Budget
        </title>
      </Helmet>

      <Row>
        {TRANSACTION_TYPES.map((type) => {
          const generateNodeProps = ({ node, path }) => ({
            buttons: [
              <Button
                size="sm"
                color="warning"
                className="btn-link px-2"
                onClick={() => toggleCategoryEdition(node)}
              >
                <i aria-hidden className="tim-icons icon-pencil" />
              </Button>,
              <Button
                size="sm"
                color="danger"
                className="btn-link px-2"
                onClick={() => remove(
                  node,
                  type,
                  removeNodeAtPath({
                    path,
                    treeData: tree[type],
                    getNodeKey: ({ treeIndex }) => treeIndex,
                  }),
                )}
              >
                <i aria-hidden className="tim-icons icon-trash-simple" />
              </Button>,
            ],
          });

          return (
            <Col xs={12} md={6} key={type}>
              <h4 className="mb-2 text-capitalize">
                {type}
                {' '}
                Categories
              </h4>
              <LoadingCard isLoading={isLoading}>
                <CardBody>
                  <div className="pull-right position-relative" style={{ zIndex: 2 }}>
                    <AddNewButton onClick={toggleForm} />
                  </div>
                  <div style={{ height: 600, zIndex: 1 }}>
                    <SortableTree
                      shouldCopyOnOutsideDrop
                      treeData={tree[type]}
                      onMoveNode={reorderNodes}
                      onChange={(treeData) => updateTree(type, treeData)}
                      generateNodeProps={generateNodeProps}
                    />
                  </div>
                </CardBody>
              </LoadingCard>
            </Col>
          );
        })}
      </Row>

      <ModalForm
        isOpen={isFormOpened}
        title={selectedCategory ? `Edit category: ${selectedCategory.name}` : 'Create new category'}
        toggleModal={toggleForm}
      >
        <CategoryForm
          isLoading={isSavingCategory}
          handleSubmit={handleCategorySubmit}
          toggleModal={toggleForm}
          modelData={selectedCategory}
        />
      </ModalForm>
    </>
  );
};

CategoryList.propTypes = {
  tree: PropTypes.object.isRequired,
  isSavingCategory: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  fetchTree: PropTypes.func.isRequired,
  updateTree: PropTypes.func.isRequired,
  setParent: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

const mapStateToProps = ({ category: { tree }, ui }) => ({
  tree,
  isSavingCategory: isActionLoading(ui.CATEGORY_CREATE) || isActionLoading(ui.CATEGORY_EDIT),
  isLoading: isActionLoading(ui.CATEGORY_FETCH_TREE),
});

export default connect(mapStateToProps, {
  fetchTree,
  updateTree,
  setParent,
  create,
  edit,
  remove,
})(CategoryList);
