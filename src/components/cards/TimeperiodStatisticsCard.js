import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Row, Col, CardHeader, CardBody } from 'reactstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import { DATERANGE_PICKER_RANGES, MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { rangeToString } from 'src/services/common';
import LoadingCard from 'src/components/cards/LoadingCard';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import IntervalSwitch from 'src/components/IntervalSwitch';

const TimeperiodStatisticsCard = ({
  isLoading,
  transparent,
  showControls,
  title,
  model,
  onUpdate,
  children,
  className,
  bodyClassName,
}) => {
  const { from, to, interval } = model;

  const onPeriodChange = (event, { startDate, endDate }) =>
    onUpdate(
      model.merge({
        from: startDate,
        to: endDate,
      }),
    );

  const onIntervalChange = (interval) => onUpdate(model.set('interval', interval));

  const showOnlyTitle = !!title && !showControls;
  const showIntervalSwitch = model instanceof TimeperiodIntervalStatistics && showControls;

  return (
    <LoadingCard isLoading={isLoading} transparent={transparent} className={className}>
      <CardHeader>
        <div className="card-category mb-0">
          {showOnlyTitle && title}
          {!showOnlyTitle && (
            <Row>
              <Col
                className={cn({
                  'order-last text-right': !showIntervalSwitch,
                })}
              >
                {showControls && (
                  <DateRangePicker
                    autoApply
                    showCustomRangeLabel
                    alwaysShowCalendars={false}
                    locale={{ format: MOMENT_DATE_FORMAT }}
                    startDate={from}
                    endDate={to}
                    ranges={DATERANGE_PICKER_RANGES}
                    onApply={onPeriodChange}
                  >
                    <span className="cursor-pointer text-nowrap">
                      {rangeToString(from, to)}
                      {'  '}
                      <i aria-hidden className="ion-md-calendar" />
                    </span>
                  </DateRangePicker>
                )}
              </Col>

              <Col
                className={cn({
                  'text-center': showIntervalSwitch,
                  'order-first text-left': !showIntervalSwitch,
                })}
              >
                <span>{title}</span>
              </Col>

              {showIntervalSwitch && (
                <Col className="text-right">
                  <IntervalSwitch selected={interval} from={from} to={to} onIntervalSwitch={onIntervalChange} />
                </Col>
              )}
            </Row>
          )}
        </div>
      </CardHeader>
      <CardBody className={bodyClassName}>{children}</CardBody>
    </LoadingCard>
  );
};

TimeperiodStatisticsCard.defaultProps = {
  bodyClassName: 'pt-0',
  className: '',
  isLoading: false,
  showControls: true,
  title: '',
  transparent: false,
};

TimeperiodStatisticsCard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  model: PropTypes.oneOfType([
    PropTypes.instanceOf(TimeperiodStatistics),
    PropTypes.instanceOf(TimeperiodIntervalStatistics),
  ]).isRequired,
  onUpdate: PropTypes.func.isRequired,
  bodyClassName: PropTypes.string,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  showControls: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  transparent: PropTypes.bool,
};

export default TimeperiodStatisticsCard;
