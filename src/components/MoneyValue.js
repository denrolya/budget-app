import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { CURRENCIES } from 'src/constants/currency';

/* eslint-disable no-param-reassign */
const MoneyValue = ({
  currency,
  amount,
  values,
  showSymbol,
  showSign,
  maximumFractionDigits,
  className,
  bold,
}) => {
  const baseCurrency = useBaseCurrency();
  const symbol = currency ? CURRENCIES[currency].symbol : baseCurrency.symbol;
  const value = values?.[baseCurrency.code];

  const absAmount = Math.abs(amount).toLocaleString(undefined, { maximumFractionDigits });

  const amountString = (
    <>
      {amount < 0 ? ' - ' : ''}
      {' '}
      <span>{showSymbol ? symbol : ''}</span>
      <span>
        {' '}
        {absAmount}
      </span>
    </>
  );
  const valueString = !!value
    && `${value < 0 ? ' - ' : ''} ${baseCurrency.symbol} ${Math.abs(value).toLocaleString(undefined, {
      maximumFractionDigits,
    })}`;

  return (
    <span
      className={cn('text-nowrap', 'd-inline-block', 'font-style-numeric', {
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
  bold: false,
  className: '',
  maximumFractionDigits: 2,
  showSign: false,
  showSymbol: true,
};

MoneyValue.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  bold: PropTypes.bool,
  currency: PropTypes.string,
  className: PropTypes.string,
  maximumFractionDigits: PropTypes.number,
  showSign: PropTypes.bool,
  showSymbol: PropTypes.bool,
  values: PropTypes.object,
};

export default MoneyValue;
