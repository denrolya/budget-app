import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import sumBy from 'lodash/sumBy';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Col, Row } from 'reactstrap';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import IntervalSwitch from 'src/components/IntervalSwitch';
import {
  DATERANGE_PICKER_RANGES,
  MOMENT_DATE_FORMAT,
  MOMENT_DATETIME_FORMAT,
  MOMENT_DEFAULT_DATE_FORMAT,
} from 'src/constants/datetime';
import { PATHS } from 'src/constants/statistics';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import MoneyValue from 'src/components/MoneyValue';
import MoneyFlowChart from 'src/components/charts/recharts/bar/MoneyFlowByInterval';
import { isActionLoading } from 'src/utils/common';
import { rangeToString } from 'src/utils/datetime';
import { randomMoneyFlowData } from 'src/utils/randomData';
import { fetchStatistics } from 'src/store/actions/statistics';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: PATHS.valueByPeriod,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
};

const MoneyFlowCard = ({
  transparent,
  fetchStatistics,
  config,
  isLoading,
  updateStatisticsTrigger,
  showCalendarSwitch,
  showIntervalSwitch,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [model, setModel] = useState(new TimeperiodIntervalStatistics({
    from: config.after,
    to: config.before,
    data: randomMoneyFlowData(),
  }));

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
        before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        interval: model.interval,
      };
      const data = await fetchStatistics({ ...config, params });
      setModel(model.set('data', data));
    };

    fetchData();
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), model.interval, updateStatisticsTrigger]);

  useEffect(() => {
    setModel(model.merge({
      from: config.after,
      to: config.before,
    }));
  }, [config.after, config.before]);

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
                onApply={(_event, { startDate, endDate }) => setModel(
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
                onIntervalSwitch={(v) => setModel(model.set('interval', v))}
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
  config: DEFAULT_CONFIG,
  isLoading: false,
  showCalendarSwitch: true,
  showIntervalSwitch: true,
  transparent: true,
  updateStatisticsTrigger: false,
};

MoneyFlowCard.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  transparent: PropTypes.bool,
  showCalendarSwitch: PropTypes.bool,
  showIntervalSwitch: PropTypes.bool,
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ ui }, { config }) => ({
  isLoading: isActionLoading(ui[`STATISTICS_FETCH_${upperCase(snakeCase(config.name))}`]),
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(MoneyFlowCard);
