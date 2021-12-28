import React from 'react';
import PropTypes from 'prop-types';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';

const localizer = momentLocalizer(moment);

const Calendar = ({
  events,
  startAccessor,
  endAccessor,
  titleAccessor,
  onSelectEvent,
  onDoubleClickEvent,
  ...rest
}) => (
  <BigCalendar
    localizer={localizer}
    events={events}
    formats={{
      selectRangeFormat: 'HH:mm',
      agendaTimeFormat: 'HH:mm',
      timeGutterFormat: 'HH:mm',
    }}
    startAccessor={startAccessor}
    endAccessor={endAccessor}
    titleAccessor={titleAccessor}
    onSelectEvent={onSelectEvent}
    onDoubleClickEvent={onDoubleClickEvent}
    {...rest}
  />
);

Calendar.defaultProps = {
  startAccessor: 'start',
  endAccessor: 'end',
  titleAccessor: 'title',
};

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.any.isRequired,
    }),
  ).isRequired,
  endAccessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  startAccessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  titleAccessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onDoubleClickEvent: PropTypes.func,
  onSelectEvent: PropTypes.func,
};

export default Calendar;
