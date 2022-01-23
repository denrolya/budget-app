import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {
  Input, InputGroup, InputGroupAddon, InputGroupText,
} from 'reactstrap';

import { rangeToString } from 'src/services/common';
import { DATERANGE_PICKER_RANGES, MOMENT_DATE_FORMAT } from 'src/constants/datetime';

const DateRange = ({
  from, to, onApply, ranges, size,
}) => {
  const handleDateRangeFilters = ({ target: { value } }) => {
    let [startDate, endDate] = value.split(' - ');
    startDate = moment(startDate, MOMENT_DATE_FORMAT, true);
    endDate = moment(endDate, MOMENT_DATE_FORMAT, true);

    if (startDate.isValid() && endDate.isValid()) {
      onApply(null, {
        startDate,
        endDate,
      });
    }
  };

  return (
    <DateRangePicker
      autoApply
      containerClass="d-block"
      alwaysShowCalendars={window.innerWidth > 729}
      locale={{ format: MOMENT_DATE_FORMAT }}
      autoUpdateInput={false}
      startDate={from}
      endDate={to}
      ranges={ranges}
      onApply={onApply}
    >
      <InputGroup size={size} className="m-0">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i aria-hidden className="ion-md-calendar" />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          value={rangeToString(moment(from, MOMENT_DATE_FORMAT), moment(to, MOMENT_DATE_FORMAT))}
          onChange={handleDateRangeFilters}
        />
      </InputGroup>
    </DateRangePicker>
  );
};

DateRange.propTypes = {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  onApply: PropTypes.func.isRequired,
  size: PropTypes.string,
  ranges: PropTypes.object,
};

DateRange.defaultProps = {
  ranges: DATERANGE_PICKER_RANGES,
};

export default DateRange;
