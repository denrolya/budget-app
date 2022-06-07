import PropTypes from 'prop-types';
import React from 'react';

import {
  MOMENT_VIEW_DATE_FORMAT,
  MOMENT_VIEW_DATE_WITH_YEAR_FORMAT,
  MOMENT_VIEW_TIME_FORMAT,
} from 'src/constants/datetime';
import { isCurrentYear, isMoreThanHourAgo } from 'src/utils/datetime';

const TransactionDate = ({
  date, showDate, showTime, showTimeIcon,
}) => (
  <>
    {showDate
      && (!isMoreThanHourAgo(date)
        ? date.fromNow()
        : date.format(!isCurrentYear(date) ? MOMENT_VIEW_DATE_WITH_YEAR_FORMAT : MOMENT_VIEW_DATE_FORMAT))}
    {showDate && showTime && ' | '}
    <span className="text-nowrap">
      {showTimeIcon && <i className="ion-ios-time" aria-hidden />}
      {' '}
      {showTime && date.format(MOMENT_VIEW_TIME_FORMAT)}
    </span>
  </>
);

TransactionDate.defaultProps = {
  showDate: true,
  showTime: true,
  showTimeIcon: false,
};

TransactionDate.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  showTime: PropTypes.bool,
  showDate: PropTypes.bool,
  showTimeIcon: PropTypes.bool,
};

export default TransactionDate;
