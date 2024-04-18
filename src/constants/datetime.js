import moment from 'moment-timezone';

export const FIRST_AVAILABLE_YEAR = 2015;
export const SERVER_TIMEZONE = 'UTC';
export const MOMENT_DATE_FORMAT = 'DD-MM-YYYY';
export const MOMENT_DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
export const MOMENT_VIEW_DATE_FORMAT = 'dddd, Do MMM';
export const MOMENT_VIEW_DATE_FORMAT_SHORT = 'DD MMM YY';
export const MOMENT_VIEW_DATE_FORMAT_LONG = 'dddd, Do MMM YY';
export const MOMENT_VIEW_DATE_WITH_YEAR_FORMAT = 'DD.MM.YYYY';
export const MOMENT_VIEW_TIME_FORMAT = 'HH:mm';
export const MOMENT_VIEW_DATETIME_FORMAT = `${MOMENT_VIEW_DATE_FORMAT} ${MOMENT_VIEW_TIME_FORMAT}`;
export const MOMENT_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';

export const DATERANGE_PICKER_RANGES = {
  '10 days': [moment().subtract(10, 'day'), moment()],
  '30 days': [moment().subtract(30, 'day'), moment()],
  'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'This Year': [moment().startOf('year'), moment().endOf('year')],
  'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
  '2 Years': [moment().subtract(2, 'year').startOf('year'), moment().endOf('year')],
  '5 Years': [moment().subtract(5, 'year').startOf('year'), moment().endOf('year')],
  '10 Years': [moment().subtract(10, 'year').startOf('year'), moment().endOf('year')],
};

export const INTERVALS = {
  '1d': {
    value: [moment().subtract(1, 'day'), moment()],
    tooltipDateFormat: 'DD MM YYYY hh:mm:ss',
    xTickFormat: 'ddd HH:00',
  },
  '1w': {
    value: [moment().subtract(1, 'week'), moment()],
    tooltipDateFormat: 'ddd Do MMM HH:00',
    xTickFormat: 'Do MMM',
  },
  '1m': {
    value: [moment().subtract(1, 'month'), moment()],
    tooltipDateFormat: 'ddd Do MMM',
    xTickFormat: 'Do MMM',
  },
  '3m': {
    value: [moment().subtract(3, 'months'), moment()],
    tooltipDateFormat: 'ddd Do MMM',
    xTickFormat: 'Do MMM',
  },
  '6m': {
    value: [moment().subtract(6, 'months'), moment()],
    tooltipDateFormat: 'ddd Do MMM',
    xTickFormat: 'Do MMM',
  },
  '1y': {
    value: [moment().subtract(1, 'year'), moment()],
    tooltipDateFormat: 'D.MM.YY',
    xTickFormat: 'Do MMM',
  },
  '2y': {
    value: [moment().subtract(2, 'years'), moment()],
    tooltipDateFormat: 'ddd Do MMM YY',
    xTickFormat: 'Do MMM',
  },
  '5y': {
    value: [moment().subtract(5, 'years'), moment()],
    tooltipDateFormat: 'ddd Do MMM YYYY',
    xTickFormat: 'Do MMM YY',
  },
  '10y': {
    value: [moment().subtract(10, 'years'), moment()],
    tooltipDateFormat: 'ddd Do MMM YYYY',
    xTickFormat: 'Do MMM YY',
  },
};
