import PropTypes from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import sumBy from 'lodash/sumBy';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { CardBody, Col, Row } from 'reactstrap';
import moment from 'moment-timezone';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import SimpleStatisticsCard from 'src/components/cards/statistics/SimpleStatisticsCard';
import CardsSet from 'src/components/CardsSet';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import PercentageSinceLastMonthMessage from 'src/components/messages/PercentageSinceLastMonthMessage';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { generateLinkToExpenses } from 'src/utils/routing';
import CategoryTreeCard from 'src/components/cards/CategoryTreeCard';
import TransactionCategoriesTimelineCard from 'src/components/cards/TransactionCategoriesTimelineCard';
import LoadingCard from 'src/components/cards/LoadingCard';
import MoneyFlowCard from 'src/components/cards/MoneyFlowCard';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { isActionLoading } from 'src/utils/common';
import { setStatistics, updateDashboard } from 'src/store/actions/dashboard';
import MoneyValue from 'src/components/MoneyValue';

const Dashboard = ({
  ui,
  statistics,
  updateDashboard,
  setStatistics,
}) => {
  const { symbol, code } = useBaseCurrency();

  useEffect(() => {
    updateDashboard();
  }, [code]);

  const isStatisticsActionLoading = (statisticsName) => isActionLoading(ui[`DASHBOARD_FETCH_STATISTICS_${upperCase(snakeCase(statisticsName))}`]);

  const totalIncome = useMemo(() => sumBy(statistics.moneyFlow.data, 'income'), [statistics.moneyFlow.data]);
  const totalExpense = useMemo(
    () => Math.abs(sumBy(statistics.moneyFlow.data, 'expense')),
    [statistics.moneyFlow.data],
  );

  /* eslint-disable react/no-unstable-nested-components */
  const shortStatistics = [
    {
      key: 'short-statistics-month-expenses',
      item: () => {
        const { from, to, data } = statistics.monthExpenses;
        const current = Math.abs(data.current);
        const previous = Math.abs(data.previous);
        return (
          <SimpleStatisticsCard
            isLoading={isStatisticsActionLoading('monthExpenses')}
            link={generateLinkToExpenses(from.format(MOMENT_DATE_FORMAT), to.format(MOMENT_DATE_FORMAT))}
            title={`Expenses in ${from.format('MMMM')}`}
            content={<MoneyValue className="font-weight-bold" amount={current} maximumFractionDigits={0} />}
            footer={<PercentageSinceLastMonthMessage previous={previous} current={current} />}
          />
        );
      },
    },
    {
      key: 'short-statistics-food',
      item: () => {
        const { from, to, data } = statistics.food;
        const current = Math.abs(data.current);
        const previous = Math.abs(data.previous);
        return (
          <SimpleStatisticsCard
            title="Food expenses"
            isLoading={isStatisticsActionLoading('food')}
            content={<MoneyValue className="font-weight-bold" amount={current} maximumFractionDigits={0} />}
            footer={<PercentageSinceLastMonthMessage previous={previous} current={current} />}
            link={generateLinkToExpenses(
              from.format(MOMENT_DATE_FORMAT),
              to.format(MOMENT_DATE_FORMAT),
              null,
              [1],
            )}
          />
        );
      },
    },
    {
      key: 'short-statistics-rent',
      item: () => {
        const { from, to, data } = statistics.rent;
        const current = Math.abs(data.current);
        const previous = Math.abs(data.previous);
        return (
          <SimpleStatisticsCard
            title="Rent & Utilities"
            isLoading={isStatisticsActionLoading('rent')}
            link={generateLinkToExpenses(
              from.format(MOMENT_DATE_FORMAT),
              to.format(MOMENT_DATE_FORMAT),
              null,
              [2, 18],
            )}
            content={<MoneyValue className="font-weight-bold" amount={current} maximumFractionDigits={0} />}
            footer={<AmountSinceLastPeriodMessage current={current} previous={previous} />}
          />
        );
      },
    },
    {
      key: 'short-statistics-daily-expenses',
      item: () => {
        const current = Math.abs(statistics.monthExpenses.data.current) / moment().date();
        const previous = Math.abs(statistics.monthExpenses.data.previous) / moment().subtract(1, 'month').daysInMonth();
        return (
          <SimpleStatisticsCard
            title="Daily expenses"
            isLoading={isStatisticsActionLoading('monthExpenses')}
            content={<MoneyValue className="font-weight-bold" maximumFractionDigits={0} amount={current} />}
            footer={<PercentageSinceLastMonthMessage previous={previous} current={current} />}
          />
        );
      },
    },
  ];
  /* eslint-enable react/no-unstable-nested-components */

  return (
    <>
      <Helmet>
        <title>
          Dashboard | Budget
        </title>
      </Helmet>

      <div className="dashboard">
        <Row>
          <Col md={12}>
            <MoneyFlowCard
              isLoading={isStatisticsActionLoading('moneyFlow')}
              model={statistics.moneyFlow}
              onUpdate={(newModel) => setStatistics('moneyFlow', newModel)}
            />
          </Col>
        </Row>

        <CardsSet items={shortStatistics} />

        <Row className="d-flex d-md-none">
          <Col xs={6}>
            <LoadingCard
              isLoading={isStatisticsActionLoading('moneyFlow')}
              className="card-chart card-chart-170 text-center"
            >
              <CardBody>
                <span className="text-nowrap text-success">
                  <sup>
                    {symbol}
                    {' '}
                  </sup>
                  <span className="h2">
                    <MoneyValue bold showSymbol={false} amount={totalIncome} maximumFractionDigits={0} />
                  </span>
                </span>
              </CardBody>
            </LoadingCard>
          </Col>
          <Col xs={6}>
            <LoadingCard
              isLoading={isStatisticsActionLoading('moneyFlow')}
              className="card-chart card-chart-170 text-center"
            >
              <CardBody>
                <span className="text-nowrap text-danger">
                  <sup>
                    {symbol}
                    {' '}
                  </sup>
                  <span className="h2">
                    <MoneyValue bold showSymbol={false} amount={totalExpense} maximumFractionDigits={0} />
                  </span>
                </span>
              </CardBody>
            </LoadingCard>
          </Col>
        </Row>

        <Row>
          <Col sm={4}>
            <CategoryTreeCard
              isLoading={isStatisticsActionLoading('expenseCategoriesTree')}
              model={statistics.expenseCategoriesTree}
              onUpdate={(newModel) => setStatistics('expenseCategoriesTree', newModel)}
            />
          </Col>
          <Col sm={8}>
            <TransactionCategoriesTimelineCard
              isLoading={isStatisticsActionLoading('categoriesTimeline')}
              model={statistics.categoriesTimeline}
              onUpdate={(newModel) => setStatistics('categoriesTimeline', newModel)}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

Dashboard.defaultProps = {
};

Dashboard.propTypes = {
  setStatistics: PropTypes.func.isRequired,
  statistics: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  updateDashboard: PropTypes.func.isRequired,
};

const mapStateToProps = ({
  dashboard: statistics,
  ui,
}) => ({
  statistics,
  ui,
});

export default connect(mapStateToProps, {
  setStatistics,
  updateDashboard,
})(Dashboard);
