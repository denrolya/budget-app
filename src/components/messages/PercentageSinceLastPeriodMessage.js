import cn from 'classnames';
import React, { useMemo } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';

import MoneyValue from 'src/components/MoneyValue';
import { randomString } from 'src/utils/randomData';
import { amountInPercentage, ratio, textColor } from 'src/utils/common';

const PercentageSinceLastPeriodMessage = ({
  previous,
  current,
  inverted,
  period,
  text,
}) => {
  const id = useMemo(() => `percentage-since-last-period-message-${randomString(8)}`, [previous, current]);
  const percentage = ratio(amountInPercentage(previous, current, 0));

  let sign = percentage > 0 ? '-' : '+';

  if (inverted) {
    sign = percentage > 0 ? '+' : '-';
  }

  return (
    <>
      <strong id={id} className={cn('font-style-numeric', 'cursor-info', textColor(percentage, inverted))}>
        {sign}
        {percentage}
        %
      </strong>
      {text && ` since ${period}`}
      <UncontrolledTooltip target={id}>
        <MoneyValue amount={previous} />
      </UncontrolledTooltip>
    </>
  );
};

PercentageSinceLastPeriodMessage.defaultProps = {
  inverted: false,
  period: 'last month',
  text: true,
};

PercentageSinceLastPeriodMessage.propTypes = {
  previous: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  inverted: PropTypes.bool,
  text: PropTypes.bool,
  period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PercentageSinceLastPeriodMessage;
