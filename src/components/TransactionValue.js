import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';
import cn from 'classnames';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { CURRENCIES } from 'src/constants/currency';
import { isExpense, isIncome } from 'src/utils/common';

const TransactionValue = ({
  className,
  maximumFractionDigits,
  transaction,
}) => {
  const { amount, account: { currency }, convertedValues } = transaction;
  const baseCurrency = useBaseCurrency();
  const symbol = currency ? CURRENCIES[currency].symbol : baseCurrency.symbol;
  const value = convertedValues?.[baseCurrency.code];

  const amountSign = ((isIncome(transaction) && amount >= 0) || (isExpense(transaction) && amount < 0)) ? '+' : '-';
  const amountString = `${amountSign} ${symbol} ${Math.abs(amount).toLocaleString(undefined, { maximumFractionDigits })}`;

  const valueSign = ((isIncome(transaction) && value >= 0) || (isExpense(transaction) && value < 0)) ? '+' : '-';
  const valueString = `${valueSign} ${baseCurrency.symbol} ${Math.abs(value).toLocaleString(undefined, { maximumFractionDigits })}`;

  return (
    <Badge
      pill
      color={isExpense(transaction) ? 'danger' : 'success'}
      className={cn('text-nowrap', 'd-inline-block', 'font-style-numeric')}
    >
      <span
        className={cn({
          [className]: !!className,
        })}
      >
        {amountString}
        {(!!value && (baseCurrency.code !== currency || amount !== value)) && (
          <span>
            {' | '}
            {valueString}
          </span>
        )}
      </span>
    </Badge>
  );
};

TransactionValue.defaultProps = {
  className: '',
  maximumFractionDigits: 2,
};

TransactionValue.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.number.isRequired,
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    account: PropTypes.shape({
      currency: PropTypes.string.isRequired,
    }).isRequired,
    convertedValues: PropTypes.object.isRequired,
  }).isRequired,
  className: PropTypes.string,
  maximumFractionDigits: PropTypes.number,
};

export default TransactionValue;
