import { Record } from 'immutable';
import moment from 'moment-timezone';

export const DEFAULT_VALUES = {
  from: moment().startOf('year'),
  to: moment().endOf('year'),
  interval: '1 month',
  data: null,
};

class TimeperiodIntervalStatistics extends Record(DEFAULT_VALUES) {}

export default TimeperiodIntervalStatistics;
