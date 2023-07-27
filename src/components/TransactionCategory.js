import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useCategoriesTree } from 'src/contexts/CategoriesContext';
import { findPath } from 'src/utils/category';

const TransactionCategory = ({ showFullPath, category }) => {
  const categories = useCategoriesTree();
  const path = useMemo(() => findPath(categories, category.id), [categories, category.id]);
  const lastCategory = path.pop();
  const { icon } = category;

  return (
    <span className="d-inline-block text-white">
      {(showFullPath && path.length > 0) && (
        <span className="d-none d-sm-inline text-muted small">
          {path.join(' / ')}
          {' / '}
        </span>
      )}
      <span>
        {icon && <i aria-hidden className={icon} />}
        {' '}
        {lastCategory}
      </span>
    </span>
  );
};

TransactionCategory.defaultProps = {
  showFullPath: true,
};

TransactionCategory.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
  }).isRequired,
  showFullPath: PropTypes.bool,
};

export default TransactionCategory;
