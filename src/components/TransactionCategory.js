import PropTypes from 'prop-types';
import React from 'react';

const TransactionCategory = ({ showFullPath, category: { fullPath, icon } }) => {
  const path = [...fullPath];
  const lastCategory = path.reverse().pop();

  return (
    <span className="d-inline-block">
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
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    fullPath: PropTypes.array,
  }).isRequired,
  showFullPath: PropTypes.bool,
};

export default TransactionCategory;
