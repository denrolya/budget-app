import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import PropTypes from 'prop-types';

const CategoriesBreadcrumbs = ({ selectedCategory, tree, selectCategory }) => (
  <Breadcrumb>
    {tree
      .first(({ model: { name } }) => name === selectedCategory)
      .getPath()
      .map(({ model: { name } }) => {
        const isActive = name === selectedCategory;

        return (
          <BreadcrumbItem
            key={name}
            active={isActive}
            onClick={() => selectCategory(name)}
          >
            <small>{name}</small>
          </BreadcrumbItem>
        );
      })}
  </Breadcrumb>
);

CategoriesBreadcrumbs.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  tree: PropTypes.object.isRequired,
  selectCategory: PropTypes.func.isRequired,
};

export default CategoriesBreadcrumbs;
