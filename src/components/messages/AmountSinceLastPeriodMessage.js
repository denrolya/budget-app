import cn from 'classnames';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';

import MoneyValue from 'src/components/MoneyValue';
import { amountInPercentage, textColor } from 'src/utils/common';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { randomString } from 'src/utils/randomData';

const AmountSinceLastPeriodMessage = ({
  previous,
  current,
  inverted,
  period,
  text,
}) => {
  const id = useMemo(() => `amount-since-last-period-message-${randomString(8)}`, [previous, current]);
  const { symbol } = useBaseCurrency();
  const percentage = amountInPercentage(previous, current, 0);
  const diff = current - previous;
  const amountString = useMemo(() => parseFloat(Math.abs(diff).toFixed()).toLocaleString(), [diff]);

  return (
    <>
      <strong id={id} className={cn('font-style-numeric', 'cursor-info', textColor(percentage, inverted))}>
        <span>
          {diff > 0 && '+'}
          {diff < 0 && '-'}
        </span>
        {symbol}
        {amountString}
      </strong>
      {(text && period) && ` since ${period}`}
      <UncontrolledTooltip target={id}>
        <MoneyValue amount={previous} />
      </UncontrolledTooltip>
    </>
  );
};

AmountSinceLastPeriodMessage.defaultProps = {
  inverted: false,
  period: 'last month',
  text: true,
};

AmountSinceLastPeriodMessage.propTypes = {
  previous: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  inverted: PropTypes.bool,
  text: PropTypes.bool,
  period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default AmountSinceLastPeriodMessage;
