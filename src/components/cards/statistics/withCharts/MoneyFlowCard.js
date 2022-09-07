import React, { memo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Col, Row } from 'reactstrap';
import IntervalSwitch from 'src/components/IntervalSwitch';
import { DATERANGE_PICKER_RANGES, MOMENT_DATE_FORMAT } from 'src/constants/datetime';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import MoneyValue from 'src/components/MoneyValue';
import MoneyFlowChart from 'src/components/charts/recharts/bar/MoneyFlowByInterval';
import { rangeToString } from 'src/utils/datetime';

const MoneyFlowCard = ({
  isLoading,
  model,
  transparent,
  onUpdate,
  showCalendarSwitch,
  showIntervalSwitch,
}) => {
  const { symbol } = useBaseCurrency();
  const {
    data, interval, from, to,
  } = model;
  const totalExpense = Math.abs(sumBy(data, 'expense'));
  const totalRevenue = sumBy(data, 'income');

  return (
    <TimeperiodStatisticsCard
      className="card-chart card-chart-170 p-0"
      transparent={transparent}
      isLoading={isLoading}
      header={(
        <Row>
          <Col>
            { showCalendarSwitch && (
              <DateRangePicker
                autoApply
                showCustomRangeLabel
                alwaysShowCalendars={false}
                locale={{ format: MOMENT_DATE_FORMAT }}
                startDate={from}
                endDate={to}
                ranges={DATERANGE_PICKER_RANGES}
                onApply={(_event, { startDate, endDate }) => onUpdate(
                  model.merge({
                    from: startDate,
                    to: endDate,
                  }),
                )}
              >
                <span className="cursor-pointer text-nowrap">
                  <i aria-hidden className="ion-ios-calendar" />
                  {'  '}
                  {rangeToString(from, to)}
                </span>
              </DateRangePicker>
            )}
          </Col>

          <Col className="text-right">
            {showIntervalSwitch && (
              <IntervalSwitch
                selected={interval}
                from={from}
                to={to}
                onIntervalSwitch={(v) => onUpdate(model.set('interval', v))}
              />
            )}
          </Col>
        </Row>
      )}
    >
      <div className="d-none d-md-flex justify-content-between px-2">
        <span className="text-nowrap text-success">
          <sup>{symbol}</sup>
          {' '}
          <span className="h2">
            <MoneyValue maximumFractionDigits={0} showSymbol={false} amount={totalRevenue} />
          </span>
        </span>

        <div className="text-nowrap text-right text-danger">
          <sup>{symbol}</sup>
          {' '}
          <span className="h2">
            <MoneyValue maximumFractionDigits={0} showSymbol={false} amount={totalExpense} />
          </span>
        </div>
      </div>
      <MoneyFlowChart data={data} interval={interval} />
    </TimeperiodStatisticsCard>
  );
};

MoneyFlowCard.defaultProps = {
  isLoading: false,
  showCalendarSwitch: true,
  showIntervalSwitch: true,
  transparent: true,
};

MoneyFlowCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodIntervalStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  transparent: PropTypes.bool,
  showCalendarSwitch: PropTypes.bool,
  showIntervalSwitch: PropTypes.bool,
};

export default memo(
  MoneyFlowCard,
  (pp, np) => isEqual(pp.model.data, np.model.data)
    && pp.isLoading === np.isLoading
    && pp.model.from.isSame(np.model.from)
    && pp.model.to.isSame(np.model.to)
    && pp.model.interval === np.model.interval,
);
