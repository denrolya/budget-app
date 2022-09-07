import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import PropTypes from 'prop-types';

const CategoriesBreadcrumbs = ({
  selectedCategory, tree, selectCategory, className,
}) => (
  <Breadcrumb listClassName="mb-0" className={className}>
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

CategoriesBreadcrumbs.defaultProps = {
  className: '',
};

CategoriesBreadcrumbs.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  tree: PropTypes.object.isRequired,
  selectCategory: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CategoriesBreadcrumbs;
