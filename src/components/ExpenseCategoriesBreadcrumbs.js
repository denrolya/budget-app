import cn from 'classnames';
import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const ExpenseCategoriesBreadcrumbs = ({ selectedCategory, data, selectCategory }) => (
  <div className="card-title mb-0">
    <span className="text-nowrap d-block d-sm-none">
      {selectedCategory !== data.model.name && (
        <Button className="px-2 py-0 btn-link text-warning h-auto m-0" onClick={() => selectCategory(data.model.name)}>
          <i aria-hidden className="ion-ios-return-left" />
        </Button>
      )}
      {selectedCategory}
    </span>
    <ol className="breadcrumb bg-transparent pt-0 pl-0 d-none d-sm-flex">
      {data
        .first(({ model: { name } }) => name === selectedCategory)
        .getPath()
        .map(({ model: { name } }) => (
          <li className="breadcrumb-item" key={name}>
            <Button
              className={cn('btn-link', 'font-weight-light', 'p-0', {
                'btn-primary': name === selectedCategory,
                'btn-secondary': name !== selectedCategory,
              })}
              onClick={() => selectCategory(name)}
            >
              <small>{name}</small>
            </Button>
          </li>
        ))}
    </ol>
  </div>
);

ExpenseCategoriesBreadcrumbs.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  selectCategory: PropTypes.func.isRequired,
};

export default ExpenseCategoriesBreadcrumbs;
