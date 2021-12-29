import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { CURRENCIES } from 'src/constants/currency';

/* eslint-disable no-param-reassign */
const MoneyValue = ({
  currency, amount, values, showSymbol, showSign, maximumFractionDigits, className, bold,
}) => {
  const baseCurrency = useBaseCurrency();
  const symbol = currency ? CURRENCIES[currency].symbol : baseCurrency.symbol;
  const value = values?.[baseCurrency.code];

  const absAmount = Math.abs(amount).toLocaleString(undefined, { maximumFractionDigits });

  const amountString = `${amount < 0 ? ' - ' : ''} ${showSymbol ? symbol : ''} ${absAmount}`;
  const valueString = !!value
    && `${value < 0 ? ' - ' : ''} ${baseCurrency.symbol} ${Math.abs(value).toLocaleString(undefined, {
      maximumFractionDigits,
    })}`;

  return (
    <span
      className={cn('text-nowrap', 'd-inline-block', {
        'font-weight-bold': bold,
        [className]: !!className,
      })}
    >
      {showSign && amount !== 0 && (amount > 0 ? ' + ' : ' - ')}
      {amountString}
      {' '}
      {!!value && symbol !== baseCurrency.symbol && (
        <small>
          |
          {valueString}
        </small>
      )}
    </span>
  );
};

MoneyValue.defaultProps = {
  showSign: false,
  showSymbol: true,
  maximumFractionDigits: 2,
  className: '',
  bold: false,
};

MoneyValue.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  bold: PropTypes.bool,
  className: PropTypes.string,
  maximumFractionDigits: PropTypes.number,
  showSign: PropTypes.bool,
  showSymbol: PropTypes.bool,
  currency: PropTypes.string,
  values: PropTypes.object,
};

export default MoneyValue;