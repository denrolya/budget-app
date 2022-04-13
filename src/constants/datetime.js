import moment from 'moment-timezone';

import { generateYearRanges } from 'src/services/datetime';

export const FIRST_AVAILABLE_YEAR = 2015;
export const SERVER_TIMEZONE = 'UTC';
export const MOMENT_DATE_FORMAT = 'DD-MM-YYYY';
export const MOMENT_DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
export const MOMENT_VIEW_DATE_FORMAT = 'Do MMM, dddd';
export const MOMENT_VIEW_DATE_WITH_YEAR_FORMAT = 'MMM, Do YYYY';
export const MOMENT_VIEW_TIME_FORMAT = 'HH:mm';
export const MOMENT_VIEW_DATETIME_FORMAT = `${MOMENT_VIEW_DATE_FORMAT} ${MOMENT_VIEW_TIME_FORMAT}`;
export const MOMENT_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';

export const ANNUAL_REPORT_RANGES = generateYearRanges(FIRST_AVAILABLE_YEAR);

export const DATERANGE_PICKER_RANGES = {
  Yesterday: [moment().subtract(1, 'day'), moment().subtract(1, 'day').add(1, 'day')],
  Today: [moment(), moment().add(1, 'day')],
  'Last Week': [moment().startOf('isoWeek').subtract(1, 'week'), moment().endOf('isoWeek').subtract(1, 'week').add(1, 'day')],
  'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek').add(1, 'day')],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month').add(1, 'day')],
  'This Month': [moment().startOf('month'), moment().endOf('month').add(1, 'day')],
  'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year').add(1, 'day')],
  'This Year': [moment().startOf('year'), moment().endOf('year').add(1, 'day')],
  Winter: [moment().month('December').subtract(1, 'year').startOf('month'), moment().month('February').endOf('month').add(1, 'day')],
  Spring: [moment().month('March').startOf('month'), moment().month('May').endOf('month').add(1, 'day')],
  Summer: [moment().month('June').startOf('month'), moment().month('August').endOf('month').add(1, 'day')],
  Autumn: [moment().month('September').startOf('month'), moment().month('November').endOf('month').add(1, 'day')],
};
