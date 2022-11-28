import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Button } from 'reactstrap';

import { rangeToString } from 'src/utils/datetime';
import { DATERANGE_PICKER_RANGES, MOMENT_DATE_FORMAT } from 'src/constants/datetime';

const DateRange = ({
  from,
  to,
  onApply,
  onReset,
  showReset,
  ranges,
}) => (
  <div className="d-flex align-center justify-content-between">
    <DateRangePicker
      autoApply
      alwaysShowCalendars={window.innerWidth > 729}
      locale={{ format: MOMENT_DATE_FORMAT }}
      autoUpdateInput={false}
      startDate={from}
      endDate={to}
      ranges={ranges}
      onApply={onApply}
    >
      <Button type="button" role="button" color="link" className="m-0 p-0 font-weight-light text-muted">
        <i className="ion-ios-calendar" />
        {'  '}
        {rangeToString(moment(from, MOMENT_DATE_FORMAT), moment(to, MOMENT_DATE_FORMAT))}
      </Button>
    </DateRangePicker>
    {showReset && (
      <Button
        type="button"
        role="button"
        color="warning"
        className="btn-simple btn-icon btn-round"
        size="sm"
        onClick={onReset}
      >
        <i aria-hidden className="ion-ios-refresh" />
      </Button>
    )}
  </div>
);

DateRange.defaultProps = {
  showReset: false,
};

DateRange.propTypes = {
  from: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  showReset: PropTypes.bool,
  ranges: PropTypes.object,
};

DateRange.defaultProps = {
  ranges: DATERANGE_PICKER_RANGES,
};

export default DateRange;
