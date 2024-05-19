import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';
import cn from 'classnames';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { CURRENCIES } from 'src/constants/currency';
import Transaction from 'src/models/Transaction';

const TransactionValue = ({
  className,
  maximumFractionDigits,
  transaction,
}) => {
  const { amount, account: { currency }, convertedValues } = transaction;
  const baseCurrency = useBaseCurrency();
  const symbol = currency ? CURRENCIES[currency].symbol : baseCurrency.symbol;
  const value = convertedValues?.[baseCurrency.code];

  const amountSign = ((transaction.isIncome() && amount >= 0) || (transaction.isExpense() && amount < 0)) ? '+' : '-';
  const amountString = `${amountSign} ${symbol} ${Math.abs(amount).toLocaleString(undefined, { maximumFractionDigits })}`;

  const valueSign = ((transaction.isIncome() && value >= 0) || (transaction.isExpense() && value < 0)) ? '+' : '-';
  const valueString = `${valueSign} ${baseCurrency.symbol} ${Math.abs(value).toLocaleString(undefined, { maximumFractionDigits })}`;

  return (
    <Badge
      pill
      color={transaction.isExpense() ? 'danger' : 'success'}
      className={cn('text-nowrap', 'd-inline-block', 'font-style-numeric')}
    >
      <span
        className={cn({
          [className]: !!className,
        })}
      >
        {amountString}
        {(!!value && (baseCurrency.code !== currency || amount !== value)) && (
          <span className="font-size-smaller font-weight-light">
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
  transaction: PropTypes.instanceOf(Transaction).isRequired,
  className: PropTypes.string,
  maximumFractionDigits: PropTypes.number,
};

export default TransactionValue;
