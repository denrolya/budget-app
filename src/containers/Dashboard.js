import PropTypes from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import sumBy from 'lodash/sumBy';
import { connect } from 'react-redux';
import { CardBody, Col, Row } from 'reactstrap';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import ExpenseCategoriesCard from 'src/components/cards/ExpenseCategoriesCard';
import TransactionCategoriesTimelineCard from 'src/components/cards/TransactionCategoriesTimelineCard';
import LoadingCard from 'src/components/cards/LoadingCard';
import MoneyFlowCard from 'src/components/cards/MoneyFlowCard';
import ShortStatistics from 'src/components/ShortStatistics';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { isActionLoading } from 'src/services/common';
import { setStatistics, updateDashboard, updateDashboardInterval } from 'src/store/actions/dashboard';
import MoneyValue from 'src/components/MoneyValue';

const Dashboard = ({
  ui, userSettings, statistics, updateDashboard, updateDashboardInterval, setStatistics,
}) => {
  const { dashboardStatistics: dashboard } = userSettings;

  useEffect(() => {
    updateDashboard();
  }, []);
  const { symbol } = useBaseCurrency();

  const isStatisticsActionLoading = (statisticsName) => isActionLoading(ui[`DASHBOARD_FETCH_STATISTICS_${upperCase(snakeCase(statisticsName))}`]);

  const totalIncome = useMemo(() => sumBy(statistics.moneyFlow.data, 'income'), [statistics.moneyFlow.data]);
  const totalExpense = useMemo(
    () => Math.abs(sumBy(statistics.moneyFlow.data, 'expense')),
    [statistics.moneyFlow.data],
  );

  return (
    <div className="dashboard">
      {dashboard.includes('moneyFlow') && (
        <Row>
          <Col md={12} lg={12} xl={12} className="d-flex">
            <MoneyFlowCard
              isLoading={isStatisticsActionLoading('moneyFlow')}
              model={statistics.moneyFlow}
              onIntervalSelect={updateDashboardInterval}
              onUpdate={(newModel) => setStatistics('moneyFlow', newModel)}
            />
          </Col>
        </Row>
      )}

      {dashboard.includes('shortExpenseForGivenPeriod') && (
        <Row>
          <ShortStatistics
            isLoading={isStatisticsActionLoading('shortExpenseForGivenPeriod')}
            onUpdate={(newModel) => setStatistics('shortExpenseForGivenPeriod', newModel)}
            model={statistics.shortExpenseForGivenPeriod}
          />
        </Row>
      )}

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
                  <MoneyValue showSymbol={false} amount={totalIncome} maximumFractionDigits={0} />
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
                  <MoneyValue showSymbol={false} amount={totalExpense} maximumFractionDigits={0} />
                </span>
              </span>
            </CardBody>
          </LoadingCard>
        </Col>
      </Row>

      <Row>
        {dashboard.includes('expenseCategoriesTree') && (
          <Col sm={12} className="d-flex">
            <ExpenseCategoriesCard
              isLoading={isStatisticsActionLoading('expenseCategoriesTree')}
              model={statistics.expenseCategoriesTree}
              onUpdate={(newModel) => setStatistics('expenseCategoriesTree', newModel)}
            />
          </Col>
        )}
      </Row>
      {dashboard.includes('transactionCategoriesTimeline') && (
        <Row>
          <Col>
            <TransactionCategoriesTimelineCard
              isLoading={isStatisticsActionLoading('transactionCategoriesTimeline')}
              model={statistics.transactionCategoriesTimeline}
              onUpdate={(newModel) => setStatistics('transactionCategoriesTimeline', newModel)}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  setStatistics: PropTypes.func.isRequired,
  statistics: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  updateDashboard: PropTypes.func.isRequired,
  updateDashboardInterval: PropTypes.func.isRequired,
  userSettings: PropTypes.object.isRequired,
};

const mapStateToProps = ({
  auth: {
    user: { settings: userSettings },
  },
  dashboard: statistics,
  ui,
}) => ({
  userSettings,
  statistics,
  ui,
});

export default connect(mapStateToProps, {
  setStatistics,
  updateDashboard,
  updateDashboardInterval,
})(Dashboard);
