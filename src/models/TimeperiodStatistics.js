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

  generatePreviousPeriod() {
    const diffInDays = this.diffIn('days');
    let from = this.from.clone().subtract(this.diffIn('days') + 1, 'days');
    let to = this.from.clone().subtract(1, 'days');

    // if whole week - previous week
    if (diffInDays === 6 && this.from.isoWeekday() === 1 && this.to.isoWeekday() === 7) {
      from = this.from.clone().subtract(1, 'day').startOf('isoWeek');
      to = this.from.clone().subtract(1, 'day').endOf('isoWeek');
    }

    // If whole month - previous month
    if (this.to.diff(this.from, 'days') + 1 === this.from.daysInMonth()) {
      from = this.from.clone().subtract(1, 'day').startOf('month');
      to = this.from.clone().subtract(1, 'day').endOf('month');
    }

    // If whole year - previous year
    if (this.from.clone().isSame(moment().startOf('year'), 'day') && this.to.clone().isSame(moment().endOf('year'), 'day')) {
      from = this.from.clone().subtract(1, 'day').startOf('year');
      to = this.from.clone().subtract(1, 'day').endOf('year');
    }

    return {
      from,
      to: to.endOf('day'),
    };
  }

  generateSincePreviousPeriodText() {
    const diffInDays = this.diffIn('days');
    let period = `last ${diffInDays} days`;

    // if whole week - previous week
    if (diffInDays === 6 && this.from.isoWeekday() === 1 && this.to.isoWeekday() === 7) {
      period = 'last week';
    }

    // If whole month - previous month
    if (this.to.diff(this.from, 'days') + 1 === this.from.daysInMonth()) {
      const previousMonth = this.from.clone().subtract(1, 'days').format('MMM');
      period = `last month(${previousMonth})`;
    }

    // If whole year - previous year
    if (this.from.clone().isSame(moment().startOf('year'), 'day') && this.to.clone().isSame(moment().endOf('year'), 'day')) {
      const previousYear = this.from.year() - 1;
      period = (previousYear === moment().year() - 1) ? `last year(${previousYear})` : previousYear;
    }

    return period;
  }
}

export default TimeperiodStatistics;
