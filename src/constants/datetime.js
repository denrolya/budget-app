import moment from 'moment-timezone';
import { generateYearRanges } from 'src/services/datetime';

export const FIRST_AVAILABLE_YEAR = 2015;
export const SERVER_TIMEZONE = 'Europe/Kiev';
export const SERVER_OFFSET = 180;
export const MOMENT_DATE_FORMAT = 'DD-MM-YYYY';
export const MOMENT_DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
export const MOMENT_VIEW_DATE_FORMAT = 'ddd, Do MMM';
export const MOMENT_VIEW_DATE_WITH_YEAR_FORMAT = 'MMM, Do YYYY';
export const MOMENT_VIEW_TIME_FORMAT = 'HH:mm';
export const MOMENT_VIEW_DATETIME_FORMAT = `${MOMENT_VIEW_DATE_FORMAT} ${MOMENT_VIEW_TIME_FORMAT}`;
export const MOMENT_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';

export const ANNUAL_REPORT_RANGES = generateYearRanges(FIRST_AVAILABLE_YEAR);

export const DATERANGE_PICKER_RANGES = {
  Yesterday: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
  Today: [moment(), moment()],
  'Last Week': [moment().startOf('isoWeek').subtract(1, 'week'), moment().endOf('isoWeek').subtract(1, 'week')],
  'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
  'This Year': [moment().startOf('year'), moment().endOf('year')],
  Winter: [moment().month('December').subtract(1, 'year').startOf('month'), moment().month('February').endOf('month')],
  Spring: [moment().month('March').startOf('month'), moment().month('May').endOf('month')],
  Summer: [moment().month('June').startOf('month'), moment().month('August').endOf('month')],
  Autumn: [moment().month('September').startOf('month'), moment().month('November').endOf('month')],
};
