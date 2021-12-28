import PropTypes from 'prop-types';
import React from 'react';

const TransactionCategory = ({ category: { fullPath, icon } }) => {
  const path = [...fullPath];
  const lastCategory = path.reverse().pop();

  return (
    <span className="d-inline-block">
      {path.length > 0 && (
        <span className="d-none d-sm-inline text-muted small">
          {path.join(' / ')}
          {' / '}
        </span>
      )}
      <span>
        {icon && <i className={icon} aria-hidden />} {lastCategory}
      </span>
    </span>
  );
};

TransactionCategory.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    fullPath: PropTypes.array,
  }).isRequired,
};

export default TransactionCategory;
