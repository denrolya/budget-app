import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { UncontrolledTooltip, Badge } from 'reactstrap';

import { useCategoriesTree } from 'src/contexts/CategoriesContext';
import { findPath } from 'src/utils/category';
import getTextColorForGivenBackground from 'src/utils/getTextColorForGivenBackground';
import { randomString } from 'src/utils/randomData';
import CategoryPath from 'src/components/CategoryPath';

const TransactionCategory = ({ showFullPath, category, className }) => {
  const randomIdString = useMemo(() => randomString(5), [category.id]);
  const categories = useCategoriesTree();
  const path = useMemo(() => findPath(categories, category.id), [categories, category.id]);
  const currentCategory = path[path.length - 1];

  return (
    <small
      className={cn({
        className,
      })}
    >
      <Badge
        pill
        id={`transaction-category-${category.id}-${randomIdString}`}
        className="font-size-smaller align-center cursor-info d-inline-block"
        style={{
          backgroundColor: currentCategory.color,
          color: getTextColorForGivenBackground(currentCategory.color),
        }}
      >
        <CategoryPath showFullPath={showFullPath} path={path} />
      </Badge>

      <UncontrolledTooltip target={`transaction-category-${category.id}-${randomIdString}`}>
        <p className="text-nowrap text-white">
          <CategoryPath path={path} />
        </p>
      </UncontrolledTooltip>
    </small>
  );
};

TransactionCategory.defaultProps = {
  showFullPath: true,
  className: '',
};

TransactionCategory.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
  showFullPath: PropTypes.bool,
};

export default TransactionCategory;
