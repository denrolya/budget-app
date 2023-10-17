import xor from 'lodash/xor';
import moment from 'moment-timezone';
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import sumBy from 'lodash/sumBy';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {
  Badge,
  Button,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from 'reactstrap';

import IncomeExpenseRatioDoughnut from 'src/components/charts/recharts/pie/IncomeExpenseRatioDoughnut';
import { HEX_COLORS } from 'src/constants/color';
import { EXPENSE_TYPE, INCOME_TYPE, TRANSACTION_TYPES } from 'src/constants/transactions';
import {
  DATERANGE_PICKER_RANGES,
  MOMENT_DATE_FORMAT,
  MOMENT_DATETIME_FORMAT,
  MOMENT_DEFAULT_DATE_FORMAT,
  MOMENT_VIEW_DATE_WITH_YEAR_FORMAT,
} from 'src/constants/datetime';
import { API } from 'src/constants/api';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import MoneyValue from 'src/components/MoneyValue';
import MoneyFlowChart from 'src/components/charts/recharts/bar/MoneyFlowByInterval';
import { amountInPercentage, ratio } from 'src/utils/common';
import { generatePreviousPeriod } from 'src/utils/datetime';
import { randomMoneyFlowData } from 'src/utils/randomData';
import { fetchStatistics } from 'src/store/actions/statistics';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: API.valueByPeriod,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
  interval: '1 month',
};

const MoneyFlowOnSteroidsCard = ({
  previousPeriod,
  config,
  fetchStatistics,
  updateStatisticsTrigger,
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
      selectedPeriod: randomMoneyFlowData(),
      previousPeriod: randomMoneyFlowData(),
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
        selectedPeriod: selectedPeriodData,
        previousPeriod: previousPeriodData,
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

  const {
    data, interval, from, to,
  } = model;

  const total = useMemo(() => ({
    selectedPeriod: {
      [INCOME_TYPE]: sumBy(data.selectedPeriod, INCOME_TYPE),
      [EXPENSE_TYPE]: Math.abs(sumBy(data.selectedPeriod, EXPENSE_TYPE)),
    },
    previousPeriod: {
      [INCOME_TYPE]: sumBy(data.previousPeriod, INCOME_TYPE),
      [EXPENSE_TYPE]: Math.abs(sumBy(data.previousPeriod, EXPENSE_TYPE)),
    },
  }), [data]);

  return (
    <TimeperiodStatisticsCard
      className="card-chart card-chart-170 p-0 pb-3"
      isLoading={isLoading}
      header={(
        <>
          <Row className="align-center">
            <Col xs={3}>
              <DateRangePicker
                autoApply
                showCustomRangeLabel
                alwaysShowCalendars
                containerClass="d-block"
                locale={{ format: MOMENT_DATE_FORMAT }}
                startDate={from}
                endDate={to}
                ranges={DATERANGE_PICKER_RANGES}
                initialSettings={{ showDropdowns: true }}
                onApply={(_event, { startDate, endDate }) => setModel(
                  model.merge({
                    from: startDate,
                    to: endDate,
                  }),
                )}
                on
              >
                <FormGroup className="m-0">
                  <InputGroup className="m-0">
                    <InputGroupText>
                      <i aria-hidden className="ion-ios-calendar" />
                    </InputGroupText>
                    <Input readOnly value={`${from.format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)} - ${to.format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}`} />
                  </InputGroup>
                </FormGroup>
              </DateRangePicker>
            </Col>
            <Col xs={1}>
              <FormGroup className="w-100 m-0">
                <Input type="select" value={interval} onChange={(e) => setModel(model.set('interval', e.target.value))}>
                  <option value="1 day">
                    Day
                  </option>
                  <option value="1 week">
                    Week
                  </option>
                  <option value="1 month">
                    Month
                  </option>
                </Input>
              </FormGroup>
            </Col>
            <Col>
              <div className="d-flex justify-content-end">
                <Button
                  size="sm"
                  className="btn-simple btn-danger m-0"
                  active={visibleTypes.includes(EXPENSE_TYPE)}
                  onClick={() => toggleTypeVisibility(EXPENSE_TYPE)}
                >
                  <i aria-hidden className="ion-ios-arrow-round-up" />
                </Button>
                <Button
                  size="sm"
                  className="btn-simple btn-success m-0"
                  active={visibleTypes.includes(INCOME_TYPE)}
                  onClick={() => toggleTypeVisibility(INCOME_TYPE)}
                >
                  <i aria-hidden className="ion-ios-arrow-round-down" />
                </Button>
              </div>
            </Col>
          </Row>

          <hr className="my-1" />
        </>
      )}
    >
      <Row noGutters>
        <Col xs={12} md={8} xl={8}>
          <MoneyFlowChart
            height="100%"
            previousPeriod={previousPeriod}
            after={model.from}
            before={model.to}
            data={data}
            interval={interval}
            visibleTypes={visibleTypes}
          />
        </Col>
        <Col xs={0} md={4} xl={4}>
          <div className="d-flex flex-column justify-content-between px-4">
            <IncomeExpenseRatioDoughnut previousPeriod={previousPeriod} height={300} data={data} />

            <div className="d-flex justify-content-between">
              <div
                className="text-nowrap pl-3 d-flex flex-column justify-content-between"
                style={{
                  borderLeft: `2px solid ${HEX_COLORS.success}`,
                }}
              >
                <h3 className="mb-0 align-center">
                  <MoneyValue showSymbol className="text-white" maximumFractionDigits={0} amount={total.selectedPeriod[INCOME_TYPE]} />
                  { previousPeriod && (
                    <Badge color={total.previousPeriod[INCOME_TYPE] >= total.selectedPeriod[INCOME_TYPE] ? 'danger' : 'success'} className="ml-1">
                      <i
                        aria-hidden
                        className={cn({
                          'ion-ios-trending-down': total.previousPeriod[INCOME_TYPE] >= total.selectedPeriod[INCOME_TYPE],
                          'ion-ios-trending-up': total.previousPeriod[INCOME_TYPE] < total.selectedPeriod[INCOME_TYPE],
                        })}
                      />
                      {` ${ratio(amountInPercentage(total.previousPeriod[INCOME_TYPE], total.selectedPeriod[INCOME_TYPE], 0))} %`}
                    </Badge>
                  )}
                </h3>
                <p className="m-0">
                  <i aria-hidden className="ion-ios-arrow-round-down" />
                  {' Incomes'}
                </p>
                {previousPeriod && (
                  <MoneyValue showSymbol className="text-muted mb-0" maximumFractionDigits={0} amount={total.previousPeriod[INCOME_TYPE]} />
                )}
              </div>

              <div
                className="text-nowrap pl-3 d-flex flex-column justify-content-between"
                style={{
                  borderLeft: `2px solid ${HEX_COLORS.danger}`,
                }}
              >
                <h3 className="mb-0 align-center">
                  <MoneyValue showSymbol className="text-white" maximumFractionDigits={0} amount={total.selectedPeriod[EXPENSE_TYPE]} />
                  {previousPeriod && (
                    <Badge color={total.previousPeriod[EXPENSE_TYPE] < total.selectedPeriod[EXPENSE_TYPE] ? 'danger' : 'success'} className="ml-1">
                      <i
                        aria-hidden
                        className={cn({
                          'ion-ios-trending-up': total.previousPeriod[EXPENSE_TYPE] < total.selectedPeriod[EXPENSE_TYPE],
                          'ion-ios-trending-down': total.previousPeriod[EXPENSE_TYPE] >= total.selectedPeriod[EXPENSE_TYPE],
                        })}
                      />
                      {` ${ratio(amountInPercentage(total.previousPeriod[EXPENSE_TYPE], total.selectedPeriod[EXPENSE_TYPE], 0))} %`}
                    </Badge>
                  )}
                </h3>
                <p className="m-0">
                  <i aria-hidden className="ion-ios-arrow-round-up" />
                  {' Expenses'}
                </p>
                {previousPeriod && (
                  <MoneyValue showSymbol className="text-muted mb-0" maximumFractionDigits={0} amount={total.previousPeriod[EXPENSE_TYPE]} />
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>

    </TimeperiodStatisticsCard>
  );
};

MoneyFlowOnSteroidsCard.defaultProps = {
  config: DEFAULT_CONFIG,
  updateStatisticsTrigger: false,
  previousPeriod: true,
};

MoneyFlowOnSteroidsCard.propTypes = {
  previousPeriod: PropTypes.bool,
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    interval: PropTypes.string,
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = ({ ui }) => ({
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(MoneyFlowOnSteroidsCard);
