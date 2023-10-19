import cn from 'classnames';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Badge, UncontrolledTooltip } from 'reactstrap';

import MoneyValue from 'src/components/MoneyValue';
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
  const diff = current - previous;
  const amountString = useMemo(() => parseFloat(Math.abs(diff).toFixed()).toLocaleString(), [diff]);
  let badgeColor = diff < 0 ? 'danger' : 'success';

  if (inverted) {
    badgeColor = diff < 0 ? 'success' : 'danger';
  }

  return (
    <span className="d-flex align-items-center">
      <Badge className="font-style-numeric cursor-info mr-1" id={id} color={badgeColor}>
        <span>
          {diff > 0 && '+'}
          {diff < 0 && '-'}
        </span>
        {symbol}
        {amountString}
      </Badge>
      {(text && period) && ` since ${period}`}
      <UncontrolledTooltip target={id}>
        <MoneyValue amount={previous} />
      </UncontrolledTooltip>
    </span>
  );
};

AmountSinceLastPeriodMessage.defaultProps = {
  period: 'last month',
  text: true,
  inverted: false,
};

AmountSinceLastPeriodMessage.propTypes = {
  previous: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  inverted: PropTypes.bool,
  text: PropTypes.bool,
  period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default AmountSinceLastPeriodMessage;
