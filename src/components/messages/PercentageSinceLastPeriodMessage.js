import cn from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { amountInPercentage, ratio, textColor } from 'src/utils/common';

const PercentageSinceLastPeriodMessage = ({
  previous,
  current,
  inverted,
  period,
  text,
}) => {
  const percentage = ratio(amountInPercentage(previous, current, 0));

  let sign = percentage > 0 ? '-' : '+';

  if (inverted) {
    sign = percentage > 0 ? '+' : '-';
  }

  return (
    <>
      <strong className={cn('font-style-numeric', textColor(percentage, inverted))}>
        {sign}
        {percentage}
        %
      </strong>
      {text && ` since ${period}`}
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
