import cn from 'classnames';
import React, { useMemo } from 'react';
import { Badge, UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';

import MoneyValue from 'src/components/MoneyValue';
import { randomString } from 'src/utils/randomData';
import { amountInPercentage, ratio } from 'src/utils/common';

const PercentageSinceLastPeriodMessage = ({
  previous,
  current,
  inverted,
  period,
  text,
}) => {
  const id = useMemo(() => `percentage-since-last-period-message-${randomString(8)}`, [previous, current]);
  const percentage = amountInPercentage(previous, current, 0);
  const percentageRatio = ratio(percentage);
  let sign = previous >= current ? '-' : '+';
  let badgeColor = previous >= current ? 'success' : 'danger';

  if (inverted) {
    sign = previous >= current ? '+' : '-';
    badgeColor = previous >= current ? 'danger' : 'success';
  }

  return (
    <span className="d-flex align-items-center">
      <Badge className="font-style-numeric cursor-info mr-1" id={id} color={badgeColor}>
        {sign}
        {percentageRatio}
        %
      </Badge>
      {text && ` since ${period}`}
      <UncontrolledTooltip target={id}>
        <MoneyValue amount={previous} />
      </UncontrolledTooltip>
    </span>
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
