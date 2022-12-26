import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import CarouselWithSwipe from 'src/components/CarouselWithSwipe';

import DailyValue from 'src/components/cards/statistics/generic/DailyValue';
import DailyInCategory from 'src/components/cards/statistics/generic/DailyInCategory';
import TotalValue from 'src/components/cards/statistics/generic/TotalValue';
import TotalInCategory from 'src/components/cards/statistics/generic/TotalInCategory';

import CategoryTreeCard from 'src/components/cards/statistics/withCharts/CategoryTreeCard';
import TransactionCategoriesTimelineCard from 'src/components/cards/statistics/withCharts/TransactionCategoriesTimelineCard';
import IncomeExpense from 'src/components/charts/recharts/bar/IncomeExpense';

import { EXPENSE_TYPE } from 'src/constants/transactions';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { isActionLoading } from 'src/utils/common';
import { randomString } from 'src/utils/randomData';
import { setStatistics, updateDashboard } from 'src/store/actions/dashboard';

const Dashboard = ({
  ui,
  statistics,
  updateDashboard,
  setStatistics,
}) => {
  const { code } = useBaseCurrency();

  useEffect(() => {
    updateDashboard();
  }, [code]);

  const isStatisticsActionLoading = (statisticsName) => isActionLoading(ui[`DASHBOARD_FETCH_STATISTICS_${upperCase(snakeCase(statisticsName))}`]);

  /* eslint-disable react/no-unstable-nested-components */
  const shortStatistics = [
    <TotalValue
      title={`Expenses in ${statistics.monthExpenses.from.format('MMMM')}`}
      footerType="percentage"
      type={EXPENSE_TYPE}
      isLoading={isStatisticsActionLoading('monthExpenses')}
      model={statistics.monthExpenses}
    />,
    <DailyValue
      footerType="amount"
      type={EXPENSE_TYPE}
      isLoading={isStatisticsActionLoading('monthExpenses')}
      model={statistics.monthExpenses}
    />,
    <DailyInCategory
      category="Food"
      footerPeriod="month"
      footerType="percentage"
      type={EXPENSE_TYPE}
      isLoading={isStatisticsActionLoading('foodExpenses')}
      model={statistics.foodExpenses}
    />,
    <TotalInCategory
      category="Rent & Utilities"
      type={EXPENSE_TYPE}
      isLoading={isStatisticsActionLoading('rentUtilityExpenses')}
      model={statistics.rentUtilityExpenses}
    />,
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
            <IncomeExpense
              model={statistics.incomeExpense}
              onUpdate={(newModel) => setStatistics('incomeExpense', newModel)}
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
