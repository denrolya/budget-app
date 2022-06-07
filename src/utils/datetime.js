import times from 'lodash/times';
import moment from 'moment-timezone';

import {
  DATERANGE_PICKER_RANGES, MOMENT_DATE_FORMAT,
  MOMENT_VIEW_DATE_FORMAT,
  MOMENT_VIEW_DATE_WITH_YEAR_FORMAT,
} from 'src/constants/datetime';

export const generateYearRanges = (startYear, endYear = moment().year()) => Object.assign(
  {},
  ...times(endYear - startYear + 1, (i) => ({
    [startYear + i]: [
      moment()
        .year(startYear + i)
        .startOf('year'),
      moment()
        .year(startYear + i)
        .endOf('year'),
    ],
  })),
);

export const rangeToString = (from, to, range = DATERANGE_PICKER_RANGES) => {
  let result = `${from.format(
    from.year() === moment().year() ? MOMENT_VIEW_DATE_FORMAT : MOMENT_VIEW_DATE_WITH_YEAR_FORMAT,
  )} - ${to.format(to.year() === moment().year() ? MOMENT_VIEW_DATE_FORMAT : MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}`;
  Object.keys(range).forEach((rangeName) => {
    if (range[rangeName][0].isSame(from, 'day') && range[rangeName][1].isSame(to, 'day')) {
      result = rangeName;
    }
  });

  return result;
};

export const generatePreviousPeriod = (from, to) => {
  const isCurrentMonth = from === moment().startOf('month').format(MOMENT_DATE_FORMAT)
                         && to === moment().endOf('month').format(MOMENT_DATE_FORMAT);

  return {
    from: isCurrentMonth
      ? from.clone().subtract(1, 'months')
      : from.clone().subtract(to.diff(from, 'days') + 1, 'days'),
    to: isCurrentMonth
      ? from.clone().subtract(1, 'days')
      : from.clone().subtract(1, 'days'),
  };
};

export const isToday = (date) => moment().isSame(date, 'date');
export const isYesterday = (date) => moment().subtract(1, 'day').isSame(date, 'date');
export const isMoreThanWeekAgo = (date) => moment().diff(date, 'days') > 7;
export const isMoreThanHourAgo = (date) => moment().diff(date, 'hours') > 1;
export const isCurrentYear = (date) => moment().year() === moment(date).year();
