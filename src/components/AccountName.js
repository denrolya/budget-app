import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import MoneyValue from 'src/components/MoneyValue';

const AccountName = ({
  colored,
  account: {
    name,
    color,
    balance,
    icon,
    convertedValues,
    currency,
  },
  showBalance,
  showIcon,
}) => (
  <>
    {showIcon && (
      <i
        aria-hidden
        style={{
          color: colored ? color : 'inherit',
        }}
        className={cn(icon)}
      />
    )}
    {!showBalance && ` ${name}`}
    {showBalance && (
      <div className="d-flex flex-column">
        <p className="text-nowrap">{name}</p>
        <MoneyValue
          bold
          amount={balance}
          values={convertedValues}
          currency={currency}
          className={cn('font-size-larger', 'font-weight-bold', {
            'text-danger': balance <= 0,
            'text-success': balance > 0,
          })}
        />
      </div>
    )}
  </>
);

AccountName.defaultProps = {
  colored: true,
  showBalance: false,
  showIcon: true,
};

AccountName.propTypes = {
  account: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    color: PropTypes.string,
    balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    convertedValues: PropTypes.object,
  }).isRequired,
  colored: PropTypes.bool,
  showBalance: PropTypes.bool,
  showIcon: PropTypes.bool,
};

export default AccountName;
