import times from 'lodash/times';
import moment from 'moment';

import {
  DATERANGE_PICKER_RANGES,
  FIRST_AVAILABLE_YEAR,
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

export const ANNUAL_REPORT_RANGES = generateYearRanges(FIRST_AVAILABLE_YEAR);

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

export const diffIn = (date1, date2, unitOfTime = 'days') => moment().isBetween(date1, date2)
  ? Math.abs(moment().diff(date1, unitOfTime) + 1)
  : Math.abs(date2.diff(date1, unitOfTime) + 1);

export const generatePreviousPeriod = (after, before, afterNow = false) => {
  const now = moment();
  const isTodayInRange = !afterNow && before.isAfter(now);
  const diff = {
    d: diffIn(after, before, 'days'),
    w: diffIn(after, before, 'weeks'),
    m: diffIn(after, before, 'months'),
    y: diffIn(after, before, 'years'),
  };
  const isWeek = after.clone().isSame(after.clone().startOf('isoWeek'), 'day') && before.clone().isSame(before.clone().endOf('isoWeek'), 'day');
  const isMonth = after.clone().isSame(after.clone().startOf('month'), 'day') && before.clone().isSame(before.clone().endOf('month'), 'day');
  const isYear = after.clone().isSame(after.clone().startOf('year'), 'day') && before.clone().isSame(before.clone().endOf('year'), 'day');

  let from = after.clone().subtract(diff.d + 1, 'days');
  let to = after.clone().subtract(1, 'days');

  if (isWeek) {
    from = isTodayInRange ? after.clone().subtract(diff.w, 'week').startOf('isoWeek') : after.clone().subtract(diff.w, 'weeks').startOf('isoWeek');
    to = isTodayInRange ? after.clone().subtract(diff.w, 'weeks') : before.clone().subtract(diff.w, 'weeks').endOf('isoWeek');
  }

  if (isMonth) {
    from = isTodayInRange ? after.clone().subtract(diff.m, 'month') : after.clone().subtract(diff.m, 'months').startOf('month');
    to = isTodayInRange ? now.clone().subtract(diff.m, 'months') : before.clone().subtract(diff.m, 'months').endOf('month');
  }

  if (isYear) {
    from = isTodayInRange ? after.clone().subtract(diff.y, 'years') : after.clone().subtract(diff.y, 'years').startOf('year');
    to = isTodayInRange ? now.clone().subtract(diff.y, 'years') : before.clone().subtract(diff.y, 'years').endOf('year');
  }

  return {
    from: from.startOf('day'),
    to: to.endOf('day'),
  };
};

export const generatePreviousPeriodNew = (dateStart, dateEnd) => {
  const start = moment(dateStart);
  const end = moment(dateEnd);
  const diffDays = end.diff(start, 'days') + 1;
  const diffWeeks = end.diff(start, 'weeks');
  const diffMonths = end.diff(start, 'months');
  const diffYears = end.diff(start, 'years');

  if (diffDays === 1) {
    return { start: start.subtract(1, 'days'), end: end.subtract(1, 'days') };
  }
  if (diffDays > 1) {
    return { start: start.subtract(diffDays, 'days'), end: end.subtract(diffDays, 'days') };
  }
  if (diffWeeks === 1) {
    return { start: start.subtract(1, 'weeks'), end: end.subtract(1, 'weeks') };
  }
  if (diffWeeks > 1) {
    return { start: start.subtract(diffWeeks, 'weeks'), end: end.subtract(diffWeeks, 'weeks') };
  }
  if (diffMonths === 1) {
    return { start: start.subtract(1, 'months'), end: end.subtract(1, 'months') };
  }
  if (diffMonths > 1) {
    return { start: start.subtract(diffMonths, 'months'), end: end.subtract(diffMonths, 'months') };
  }
  if (diffYears === 1) {
    return { start: start.subtract(1, 'years').startOf('year').startOf('day'), end: end.subtract(1, 'years').endOf('year') };
  }
  if (diffYears > 1) {
    return { start: start.subtract(diffYears, 'years').startOf('year'), end: end.subtract(diffYears, 'years').endOf('year') };
  }

  throw new Error('Invalid date range');
};

export const generateSincePreviousPeriodText = (after, before) => {
  const diffInDays = diffIn(after, before, 'days');
  let period = `last ${diffInDays} days`;

  // if whole week - previous week
  if (diffInDays === 6 && after.isoWeekday() === 1 && before.isoWeekday() === 7) {
    period = 'last week';
  }

  // If whole month - previous month
  if (before.diff(after, 'days') + 1 === after.daysInMonth()) {
    const previousMonth = after.clone().subtract(1, 'days').format('MMM');
    period = `last month(${previousMonth})`;
  }

  // If whole year - previous year
  if (after.clone().isSame(moment().startOf('year'), 'day') && before.clone().isSame(moment().endOf('year'), 'day')) {
    const previousYear = after.year() - 1;
    period = previousYear === moment().year() - 1 ? `last year(${previousYear})` : previousYear;
  }

  return period;
};

export const isToday = (date) => moment().isSame(date, 'date');
export const isYesterday = (date) => moment().subtract(1, 'day').isSame(date, 'date');
export const isMoreThanWeekAgo = (date) => moment().diff(date, 'days') > 7;
export const isMoreThanHourAgo = (date) => moment().diff(date, 'hours') > 1;
export const isCurrentYear = (date) => moment().year() === moment(date).year();

export const countWeekdays = (after, before, weekday) => {
  if (weekday < 0 || weekday > 6) {
    throw new Error('Invalid weekday. Please provide a value between 0 and 6 (Sunday to Saturday).');
  }

  let count = 0;
  const startDate = after.clone().startOf('day');
  const endDate = before.clone().startOf('day');

  while (startDate.isSameOrBefore(endDate)) {
    if (startDate.day() === weekday) {
      count += 1;
    }
    startDate.add(1, 'day');
  }

  return count;
};
