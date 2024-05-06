import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const CategoryPath = ({ showFullPath, path }) => {
  const currentCategory = path[path.length - 1];
  const pathString = useMemo(() => (path.length > 1)
    ? path.slice(0, path.length - 1).map(({ name }) => name).join(' / ')
    : null, [currentCategory.id]);

  return (
    <>
      { (showFullPath && path.length > 0) && (
        <span className="d-none d-sm-inline small text-nowrap">
          { pathString && `${pathString} / ` }
        </span>
      ) }
      <span>
        { currentCategory.icon && <i aria-hidden className={cn(currentCategory.icon, 'font-size-larger', 'mx-1')} /> }
        { currentCategory.name }
      </span>
    </>
  );
};

CategoryPath.defaultProps = {
  showFullPath: true,
};

CategoryPath.propTypes = {
  path: PropTypes.array.isRequired,
  showFullPath: PropTypes.bool,
};

export default CategoryPath;
