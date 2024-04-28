import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { CURRENCIES } from 'src/constants/currency';

/* eslint-disable no-param-reassign */
const MoneyValue = ({
  id,
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

  const amountElement = (
    <>
      { showSign && (
        (amount < 0) ? ' - ' : ' + '
      )}
      <span>{showSymbol ? symbol : ''}</span>
      <span>
        {' '}
        {Math.abs(amount).toLocaleString(undefined, { maximumFractionDigits })}
      </span>
    </>
  );
  const valueElement = !!value && (
    <>
      { showSign && (
        (value < 0) ? ' - ' : ' + '
      )}
      <span>{baseCurrency.symbol}</span>
      <span>
        {' '}
        {Math.abs(value).toLocaleString(undefined, { maximumFractionDigits })}
      </span>
    </>
  );

  return (
    <span
      id={id}
      className={cn('text-nowrap', 'd-inline-block', 'font-style-numeric', {
        'font-weight-bold': bold,
        [className]: !!className,
      })}
    >
      {amountElement}
      {(!!value && (baseCurrency.code !== currency || amount !== value)) && (
        <span>
          {' | '}
          {valueElement}
        </span>
      )}
    </span>
  );
};

MoneyValue.defaultProps = {
  bold: false,
  className: '',
  currency: undefined,
  id: undefined,
  maximumFractionDigits: 2,
  showSign: false,
  showSymbol: true,
  values: [],
};

MoneyValue.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  id: PropTypes.string,
  bold: PropTypes.bool,
  currency: PropTypes.string,
  className: PropTypes.string,
  maximumFractionDigits: PropTypes.number,
  showSign: PropTypes.bool,
  showSymbol: PropTypes.bool,
  values: PropTypes.object,
};

export default MoneyValue;
