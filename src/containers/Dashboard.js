import PropTypes from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import sumBy from 'lodash/sumBy';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { CardBody, Col, Row } from 'reactstrap';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import DailyExpenses from 'src/components/cards/statistics/simple/DailyExpenses';
import FoodExpenses from 'src/components/cards/statistics/simple/FoodExpenses';
import MonthExpenses from 'src/components/cards/statistics/simple/MonthExpenses';
import RentUtilityExpenses from 'src/components/cards/statistics/simple/RentUtilityExpenses';
import CarouselWithSwipe from 'src/components/CarouselWithSwipe';
import CategoryTreeCard from 'src/components/cards/CategoryTreeCard';
import TransactionCategoriesTimelineCard from 'src/components/cards/TransactionCategoriesTimelineCard';
import LoadingCard from 'src/components/cards/LoadingCard';
import MoneyFlowCard from 'src/components/cards/MoneyFlowCard';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { isActionLoading } from 'src/utils/common';
import { randomString } from 'src/utils/randomData';
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
    <MonthExpenses isLoading={isStatisticsActionLoading('monthExpenses')} model={statistics.monthExpenses} />,
    <FoodExpenses isLoading={isStatisticsActionLoading('foodExpenses')} model={statistics.foodExpenses} />,
    <RentUtilityExpenses isLoading={isStatisticsActionLoading('rentUtilityExpenses')} model={statistics.rentUtilityExpenses} />,
    <DailyExpenses isLoading={isStatisticsActionLoading('monthExpenses')} model={statistics.monthExpenses} />,
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

        <Row>
          <Col xs={12} className="d-md-none">
            <CarouselWithSwipe data={shortStatistics} />
          </Col>

          {shortStatistics.map((item) => (
            <Col md={6} lg={3} className="d-none d-md-block" key={randomString(4)}>
              { item }
            </Col>
          ))}
        </Row>

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
