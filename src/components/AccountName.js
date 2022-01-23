import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import MoneyValue from 'src/components/MoneyValue';
import {
  ACCOUNT_TYPE_BANK_CARD,
  ACCOUNT_TYPE_BASIC,
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_INTERNET,
} from 'src/constants/account';

const AccountName = ({
  colored, account: {
    name, color, balance, icon, convertedValues, currency,
  }, showBalance, showIcon,
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
        {balance && (
          <MoneyValue
            bold
            amount={balance}
            values={convertedValues}
            currency={currency}
            className={cn('text-currency', 'font-size-larger', 'font-weight-bold', {
              'text-white': balance === 0,
              'text-danger': balance < 0,
              'text-success': balance > 0,
            })}
          />
        )}
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
    balance: PropTypes.number,
    convertedValues: PropTypes.object,
  }).isRequired,
  colored: PropTypes.bool,
  showBalance: PropTypes.bool,
  showIcon: PropTypes.bool,
};

export default AccountName;
