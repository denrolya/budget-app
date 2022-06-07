import cn from 'classnames';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { amountInPercentage, textColor } from 'src/utils/common';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const AmountSinceLastPeriodMessage = ({
  previous, current, invertedColors, period, text,
}) => {
  const { symbol } = useBaseCurrency();
  const percentage = amountInPercentage(previous, current, 0);
  const diff = current - previous;
  const amountString = useMemo(() => parseFloat(Math.abs(diff).toFixed()).toLocaleString(), [diff]);

  return (
    <>
      <strong className={cn('font-style-numeric', textColor(percentage, invertedColors))}>
        <span>
          {diff > 0 && '+'}
          {diff < 0 && '-'}
        </span>
        {symbol}
        {amountString}
      </strong>
      {(text && period) && ` since ${period}`}
    </>
  );
};

AmountSinceLastPeriodMessage.defaultProps = {
  invertedColors: false,
  period: 'last month',
  text: true,
};

AmountSinceLastPeriodMessage.propTypes = {
  previous: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  invertedColors: PropTypes.bool,
  text: PropTypes.bool,
  period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default AmountSinceLastPeriodMessage;
