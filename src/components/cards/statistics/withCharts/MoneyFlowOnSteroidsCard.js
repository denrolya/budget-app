import xor from 'lodash/xor';
import moment from 'moment-timezone';
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import sumBy from 'lodash/sumBy';
import {
  Badge,
  Button,
  ButtonGroup,
  Col,
  Input,
  Row,
} from 'reactstrap';

import IncomeExpenseRatioDoughnut from 'src/components/charts/recharts/pie/IncomeExpenseRatioDoughnut';
import { HEX_COLORS } from 'src/constants/color';
import { EXPENSE_TYPE, INCOME_TYPE, TRANSACTION_TYPES } from 'src/constants/transactions';
import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
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
      previousPeriod: previousPeriod ? randomMoneyFlowData() : undefined,
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

      if (previousPeriod) {
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
      } else {
        setModel(model.set('data', {
          selectedPeriod: selectedPeriodData,
        }));
      }

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
    data, interval, from,
  } = model;

  const total = useMemo(() => ({
    selectedPeriod: {
      [INCOME_TYPE]: sumBy(data.selectedPeriod, INCOME_TYPE),
      [EXPENSE_TYPE]: Math.abs(sumBy(data.selectedPeriod, EXPENSE_TYPE)),
    },
    previousPeriod: previousPeriod ? {
      [INCOME_TYPE]: sumBy(data.previousPeriod, INCOME_TYPE),
      [EXPENSE_TYPE]: Math.abs(sumBy(data.previousPeriod, EXPENSE_TYPE)),
    } : undefined,
  }), [data]);

  const setYear = (year) => setModel(
    model.merge({
      from: moment().year(year).startOf('year'),
      to: moment().year(year).endOf('year'),
    }),
  );

  return (
    <TimeperiodStatisticsCard
      className="card-chart card-chart-170 p-0 pb-3"
      isLoading={isLoading}
      header={(
        <>
          <Row noGutters className="align-center">
            <Col xs={4}>
              <Input
                type="number"
                bsSize="sm"
                value={from.year()}
                onChange={(e) => setYear(e.target.value)}
              />
            </Col>
            <Col className="px-1" xs={2}>
              <Input
                type="select"
                bsSize="sm"
                value={interval}
                onChange={(e) => setModel(model.set('interval', e.target.value))}
              >
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
            </Col>
            <Col xs={6}>
              <div className="d-flex justify-content-end">
                <ButtonGroup>
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
                </ButtonGroup>
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
            <IncomeExpenseRatioDoughnut height={300} previousPeriod={previousPeriod} data={data} />

            <Row noGutters>
              <Col xs={12} lg={6}>
                <div
                  className="text-nowrap px-3 d-flex flex-column justify-content-between"
                  style={{
                    borderLeft: `2px solid ${HEX_COLORS.success}`,
                  }}
                >
                  <h3 className="d-flex justify-content-between align-items-center mb-0">
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
              </Col>

              <Col xs={12} lg={6}>
                <div
                  className="text-nowrap px-3 d-flex flex-column justify-content-between"
                  style={{
                    borderLeft: `2px solid ${HEX_COLORS.danger}`,
                  }}
                >
                  <h3 className="d-flex justify-content-between align-items-center mb-0">
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
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

    </TimeperiodStatisticsCard>
  );
};

MoneyFlowOnSteroidsCard.defaultProps = {
  config: DEFAULT_CONFIG,
  previousPeriod: true,
  updateStatisticsTrigger: false,
};

MoneyFlowOnSteroidsCard.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    interval: PropTypes.string,
  }),
  previousPeriod: PropTypes.bool,
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = ({ ui: { updateStatisticsTrigger } }) => ({ updateStatisticsTrigger });

export default connect(mapStateToProps, { fetchStatistics })(MoneyFlowOnSteroidsCard);
