import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';

import { rangeToString } from 'src/utils/datetime';
import { DATERANGE_PICKER_RANGES, MOMENT_DATE_FORMAT } from 'src/constants/datetime';

const DateRange = ({
  from,
  to,
  onApply,
  ranges,
  size,
}) => (
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
          <i
            aria-hidden
            className={cn({
              'ion-ios-trash': from && to,
              'ion-ios-calendar': !from && !to,
            })}
          />
        </InputGroupText>
      </InputGroupAddon>
      <Input
        type="text"
        defaultValue={rangeToString(moment(from, MOMENT_DATE_FORMAT), moment(to, MOMENT_DATE_FORMAT))}
      />
    </InputGroup>
  </DateRangePicker>
);

DateRange.defaultProps = {
  size: undefined,
};

DateRange.propTypes = {
  from: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onApply: PropTypes.func.isRequired,
  size: PropTypes.string,
  ranges: PropTypes.object,
};

DateRange.defaultProps = {
  ranges: DATERANGE_PICKER_RANGES,
};

export default DateRange;
