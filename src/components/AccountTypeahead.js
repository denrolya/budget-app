import cn from 'classnames';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Highlighter, Token, Typeahead } from 'react-bootstrap-typeahead';

import { useAccountsWithDefaultOrder, useActiveAccountsWithDefaultOrder } from 'src/contexts/AccountsContext';
import getTextColorForGivenBackground from 'src/utils/getTextColorForGivenBackground';

/* eslint-disable react/jsx-props-no-spreading */
const AccountTypeahead = ({
  id, multiple, onChange, selected, withArchived, ...rest
}) => {
  const typeaheads = [];
  const activeAccounts = useActiveAccountsWithDefaultOrder();
  const allAccounts = useAccountsWithDefaultOrder();

  const formattedSelected = useMemo(() => {
    let result;
    if (Array.isArray(selected) && selected.length > 0) {
      result = allAccounts.filter(({ id }) => id === Number(selected[0].id));
    } else {
      result = allAccounts.filter(({ id }) => id === Number(selected));
    }
    return result;
  }, [allAccounts, selected]);

  const renderMenuItemChildren = (option, itemProps) => (
    <React.Fragment key={`account-dropdown-item-${option.id}`}>
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

  return (
    <Typeahead
      labelKey="name"
      placeholder="Account"
      bsSize="sm"
      id={`account-typeahead-${id}`}
      multiple={multiple}
      options={withArchived ? allAccounts : activeAccounts}
      selected={formattedSelected}
      onChange={onChange}
      ref={(t) => typeaheads.push(t)}
      renderMenuItemChildren={renderMenuItemChildren}
      renderToken={renderToken}
      {...rest}
    />
  );
};

AccountTypeahead.defaultProps = {
  multiple: false,
  selected: [],
  withArchived: false,
};

AccountTypeahead.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  selected: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    })),
    PropTypes.number,
    PropTypes.string,
  ]),
  withArchived: PropTypes.bool,
};

export default AccountTypeahead;
