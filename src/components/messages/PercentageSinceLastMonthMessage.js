import cn from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { amountInPercentage, ratio, textColor } from 'src/services/common';

const PercentageSinceLastMonthMessage = ({
  previous, current, invertedColors, period, text,
}) => {
  const percentage = ratio(amountInPercentage(previous, current, 0));

  return (
    <>
      <strong className={cn(textColor(percentage, invertedColors))}>
        {percentage > 0 ? '-' : '+'}
        {percentage}
        %
      </strong>
      {text && ` since ${period}`}
    </>
  );
};

PercentageSinceLastMonthMessage.defaultProps = {
  invertedColors: false,
  period: 'last month',
  text: true,
};

PercentageSinceLastMonthMessage.propTypes = {
  previous: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  invertedColors: PropTypes.bool,
  text: PropTypes.bool,
  period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PercentageSinceLastMonthMessage;
