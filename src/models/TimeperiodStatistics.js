import { Record } from 'immutable';
import moment from 'moment-timezone';

export const DEFAULT_VALUES = {
  from: moment().startOf('month'),
  to: moment().endOf('month'),
  data: null,
};

class TimeperiodStatistics extends Record(DEFAULT_VALUES) {
  diffIn(unitOfTime = 'days') {
    return moment().isBetween(this.from, this.to)
      ? moment().diff(this.from, unitOfTime) + 1
      : this.to.diff(this.from, unitOfTime) + 1;
  }
}

export default TimeperiodStatistics;
