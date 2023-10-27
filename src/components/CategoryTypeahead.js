import cn from 'classnames';
import sortBy from 'lodash/sortBy';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import differenceBy from 'lodash/differenceBy';
import { Highlighter, Token, Typeahead } from 'react-bootstrap-typeahead';

import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import { useCategories } from 'src/contexts/CategoriesContext';
import getTextColorForGivenBackground from 'src/utils/getTextColorForGivenBackground';
import { randomString } from 'src/utils/randomData';

/* eslint-disable react/jsx-props-no-spreading */
const CategoryTypeahead = ({
  multiple, options, onChange, selected, ...rest
}) => {
  const typeaheads = [];
  const categories = useCategories();

  const renderMenuItemChildren = (option, itemProps) => (
    <React.Fragment key={`category-dropdown-item-${option.id}`}>
      <div>
        <i
          aria-hidden
          className={cn('mr-1', option.icon)}
          style={{
            color: option.color,
          }}
        />
        <Highlighter search={itemProps.text}>{option[itemProps.labelKey]}</Highlighter>
      </div>
      <small className="d-block">
        {'ID: '}
        <code>
          #
          {option.id}
        </code>
      </small>
      <small
        className={cn('d-block', {
          'text-success': option.type === INCOME_TYPE,
          'text-danger': option.type === EXPENSE_TYPE,
        })}
      >
        {'Type: '}
        <span className="text-capitalize">{option.type}</span>
      </small>
      <small className="d-block">
        {'Parent: '}
        {option?.parent ? (
          <>
            <i
              aria-hidden
              className={cn('mr-1', option.parent.icon)}
              style={{
                color: option.parent.color,
              }}
            />
            {option.parent.name}
          </>
        ) : (
          'Root category'
        )}
      </small>
      <small className="d-block">
        {'Root: '}
        {option?.root ? (
          <>
            <i
              aria-hidden
              className={cn('mr-1', option.root.icon)}
              style={{
                color: option.root.color,
              }}
            />
            {option.root.name}
          </>
        ) : (
          'Root category'
        )}
      </small>
    </React.Fragment>
  );

  const renderToken = (option, { onRemove }, index) => (
    <Token
      onRemove={onRemove}
      key={index}
      option={option}
      style={{
        backgroundColor: option.color,
        color: getTextColorForGivenBackground(option.color),
      }}
    >
      <i aria-hidden className={option.icon} />
      {' '}
      {option.name}
    </Token>
  );

  const optionsSortedAndFiltered = useMemo(
    () => sortBy(options.length > 0 ? options : differenceBy(categories, selected, 'id'), ['type', 'name']),
    [categories, selected],
  );

  return (
    <Typeahead
      labelKey="name"
      placeholder="Categories"
      bsSize="sm"
      id={randomString(5)}
      multiple={multiple}
      options={optionsSortedAndFiltered}
      selected={selected}
      onChange={onChange}
      ref={(t) => typeaheads.push(t)}
      renderMenuItemChildren={renderMenuItemChildren}
      renderToken={renderToken}
      {...rest}
    />
  );
};

CategoryTypeahead.defaultProps = {
  multiple: true,
  options: [],
  selected: [],
};

CategoryTypeahead.propTypes = {
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  options: PropTypes.array,
  selected: PropTypes.array,
};

export default CategoryTypeahead;
