import cn from 'classnames';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { amountInPercentage } from 'src/utils/common';

const PreviousMonthStatisticsCell = ({ currentMonthValue, previousMonthValue, numberOfMonthAgo }) => {
  const { symbol } = useBaseCurrency();
  const percentageRatio = currentMonthValue > 0 ? amountInPercentage(previousMonthValue, currentMonthValue) - 100 : -100;

  if (!percentageRatio) {
    return null;
  }

  const month = moment().subtract(numberOfMonthAgo, 'months').startOf('month');
  const sinceText = numberOfMonthAgo > 1 ? `Since ${month.format('MMMM')}` : 'Since last month';

  return (
    <td>
      <span id={`month-ago-${numberOfMonthAgo}`} className="mr-2 text-nowrap">
        <span
          className={cn('small', {
            'text-success': percentageRatio <= 0,
            'text-danger': percentageRatio > 0,
          })}
        >
          <i
            className={cn({
              'ion-md-arrow-dropdown': percentageRatio < 0,
              'ion-md-arrow-dropup': percentageRatio >= 0,
            })}
          />
          {' '}
          {Math.abs(percentageRatio).toFixed()}
          %
        </span>
        <UncontrolledTooltip target={`month-ago-${numberOfMonthAgo}`}>
          {month.format('MMMM')}
          :
          {' '}
          <strong>
            {symbol}
            {' '}
            {previousMonthValue}
          </strong>
        </UncontrolledTooltip>
      </span>
      <span className="text-right text-nowrap text-light">{sinceText}</span>
    </td>
  );
};

PreviousMonthStatisticsCell.propTypes = {
  currentMonthValue: PropTypes.number.isRequired,
  previousMonthValue: PropTypes.number.isRequired,
  numberOfMonthAgo: PropTypes.number.isRequired,
};

export default PreviousMonthStatisticsCell;
