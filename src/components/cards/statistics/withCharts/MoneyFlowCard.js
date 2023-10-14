import xor from 'lodash/xor';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import sumBy from 'lodash/sumBy';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Col, Row } from 'reactstrap';

import IntervalSwitch from 'src/components/IntervalSwitch';
import { EXPENSE_TYPE, INCOME_TYPE, TRANSACTION_TYPES } from 'src/constants/transactions';
import {
  DATERANGE_PICKER_RANGES,
  MOMENT_DATE_FORMAT,
  MOMENT_DATETIME_FORMAT,
  MOMENT_DEFAULT_DATE_FORMAT,
} from 'src/constants/datetime';
import { API } from 'src/constants/api';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import MoneyValue from 'src/components/MoneyValue';
import MoneyFlowChart from 'src/components/charts/recharts/bar/MoneyFlowByInterval';
import { generatePreviousPeriod, rangeToString } from 'src/utils/datetime';
import { randomMoneyFlowData } from 'src/utils/randomData';
import { fetchStatistics } from 'src/store/actions/statistics';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: API.valueByPeriod,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
  interval: '1 month',
};

const MoneyFlowCard = ({
  transparent,
  fetchStatistics,
  config,
  updateStatisticsTrigger,
  showCalendarSwitch,
  showIntervalSwitch,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(new TimeperiodIntervalStatistics({
    from: config.after,
    to: config.before,
    interval: config.interval,
    data: {
      current: randomMoneyFlowData(),
      previous: randomMoneyFlowData(),
    },
  }));
  const [visibleTypes, setVisibleTypes] = useState(TRANSACTION_TYPES);
  const toggleTypeVisibility = (type) => setVisibleTypes(xor(visibleTypes, [type]));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const selectedPeriodData = await fetchStatistics({
        ...config,
        params: {
          after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
          before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
          interval: model.interval,
        },
      });

      const previousPeriod = generatePreviousPeriod(model.from, model.to, true);

      const previousPeriodData = await fetchStatistics({
        ...config,
        params: {
          after: previousPeriod.from.format(MOMENT_DEFAULT_DATE_FORMAT),
          before: previousPeriod.to.format(MOMENT_DEFAULT_DATE_FORMAT),
          interval: model.interval,
        },
      });

      setModel(model.set('data', {
        current: selectedPeriodData,
        previous: previousPeriodData,
      }));
      setIsLoading(false);
    };

    fetchData();
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), model.interval, updateStatisticsTrigger]);

  useEffect(() => {
    setModel(model.merge({
      from: config.after,
      to: config.before,
      interval: config.interval,
    }));
  }, [config.after, config.before, config.interval]);

  const { symbol } = useBaseCurrency();
  const {
    data, interval, from, to,
  } = model;
  const totalExpense = Math.abs(sumBy(data.current, 'expense'));
  const totalRevenue = sumBy(data.current, 'income');

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
      <MoneyFlowChart data={data} visibleTypes={visibleTypes} />
    </TimeperiodStatisticsCard>
  );
};

MoneyFlowCard.defaultProps = {
  config: DEFAULT_CONFIG,
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
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    interval: PropTypes.string,
  }),
  transparent: PropTypes.bool,
  showCalendarSwitch: PropTypes.bool,
  showIntervalSwitch: PropTypes.bool,
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = ({ ui }) => ({
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(MoneyFlowCard);
