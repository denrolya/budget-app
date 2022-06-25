import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';
import { Row, Col, UncontrolledCollapse } from 'reactstrap';

import { ANNUAL_REPORT_RANGES, MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { INCOME_TYPE, EXPENSE_TYPE } from 'src/constants/transactions';

import { amountInPercentage, isActionLoading } from 'src/utils/common';
import { rangeToString } from 'src/utils/datetime';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { setStatistics, updateReport, setPeriod } from 'src/store/actions/report';

import MainIncomeSourceCard from 'src/components/cards/statistics/icon/MainIncomeSourceCard';
import PercentageSpentFromIncomeCard from 'src/components/cards/statistics/icon/PercentageSpentFromIncomeCard';

import TotalIncome from 'src/components/cards/statistics/simple/TotalIncome';
import Average from 'src/components/cards/statistics/simple/Average';
import DailyInCategory from 'src/components/cards/statistics/simple/DailyInCategory';
import DailyIncome from 'src/components/cards/statistics/simple/DailyIncome';
import TotalInCategory from 'src/components/cards/statistics/simple/TotalInCategory';
import MinMax from 'src/components/cards/statistics/simple/MinMax';
import TotalExpense from 'src/components/cards/statistics/simple/TotalExpense';

import NewCategoriesCard from 'src/components/cards/statistics/NewCategoriesCard';

import AccountExpenseDistributionCard from 'src/components/cards/statistics/withCharts/AccountExpenseDistributionCard';
import ExpenseCategoriesByWeekdaysCard from 'src/components/cards/statistics/withCharts/ExpenseCategoriesByWeekdaysCard';
import TotalExpensesByIntervalCard from 'src/components/cards/statistics/withCharts/TotalExpensesByIntervalCard';
import ExpenseCategoriesReviewCard from 'src/components/cards/statistics/withCharts/ExpenseCategoriesReviewCard';
import UtilityCostsByIntervalCard from 'src/components/cards/statistics/withCharts/UtilityCostsByIntervalCard';
import CategoryTreeCard from 'src/components/cards/statistics/withCharts/CategoryTreeCard';
import MoneyFlowCard from 'src/components/cards/statistics/withCharts/MoneyFlowCard';

const Report = ({
  ui,
  statistics,
  updateReport,
  setStatistics,
  setPeriod,
}) => {
  const { code } = useBaseCurrency();

  const isStatisticsActionLoading = (statisticsName) => isActionLoading(ui[`REPORT_FETCH_STATISTICS_${upperCase(snakeCase(statisticsName))}`]);

  const { from, to } = statistics.moneyFlow;

  useEffect(() => {
    updateReport();
  }, [code, from.year()]);

  return (
    <>
      <Helmet>
        <title>
          {`${from.year()} Report | Budget`}
        </title>
      </Helmet>

      <DateRangePicker
        autoApply
        showCustomRangeLabel
        alwaysShowCalendars={false}
        ranges={ANNUAL_REPORT_RANGES}
        locale={{ format: MOMENT_DATE_FORMAT }}
        startDate={from}
        endDate={to}
        onApply={(event, { startDate, endDate }) => setPeriod(startDate.year(), endDate.year())}
      >
        <span className="cursor-pointer text-nowrap">
          {rangeToString(from, to, ANNUAL_REPORT_RANGES)}
          {'  '}
          <i aria-hidden className="ion-md-calendar" />
        </span>
      </DateRangePicker>

      <section>
        <MoneyFlowCard
          isLoading={isStatisticsActionLoading('moneyFlow')}
          model={statistics.moneyFlow}
          onIntervalSelect={() => {}}
          onUpdate={(newModel) => setStatistics('moneyFlow', newModel)}
        />
      </section>

      <hr />

      <section>
        <h1 id="incomes" className="cursor-pointer">Incomes</h1>
        <UncontrolledCollapse defaultOpen toggler="#incomes">
          <Row>
            <Col xs={12} md={6} lg={4}>
              <TotalIncome
                isLoading={isStatisticsActionLoading('totalIncome')}
                model={statistics.totalIncome}
              />

              <DailyIncome
                isLoading={isStatisticsActionLoading('totalIncome')}
                model={statistics.totalIncome}
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <CategoryTreeCard
                showDailyAnnual
                type={INCOME_TYPE}
                isLoading={isStatisticsActionLoading('incomeCategoriesTree')}
                model={statistics.incomeCategoriesTree}
                onUpdate={(newModel) => setStatistics('incomeCategoriesTree', newModel)}
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              {statistics.incomeCategoriesTree.data && (
                <MainIncomeSourceCard
                  isLoading={isStatisticsActionLoading('incomeCategoriesTree')}
                  model={statistics.incomeCategoriesTree}
                />
              )}
              <NewCategoriesCard
                type={INCOME_TYPE}
                isLoading={isStatisticsActionLoading('incomeCategoriesTree')}
                model={statistics.incomeCategoriesTree}
              />
            </Col>
          </Row>
        </UncontrolledCollapse>
      </section>

      <hr />

      <section>
        <h1>Expenses</h1>

        <h3 id="general-expenses" className="cursor-pointer">General expenses</h3>

        <UncontrolledCollapse defaultOpen toggler="#general-expenses">
          <Row>
            <Col xs={12} md={6} lg={4}>
              <CategoryTreeCard
                showDailyAnnual
                isLoading={isStatisticsActionLoading('expenseCategoriesTree')}
                model={statistics.expenseCategoriesTree}
                onUpdate={(newModel) => setStatistics('expenseCategoriesTree', newModel)}
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              {statistics.totalIncome.data.current && statistics.totalExpense.data.current && (
                <PercentageSpentFromIncomeCard
                  isLoading={isStatisticsActionLoading('totalExpense') || isStatisticsActionLoading('totalIncome')}
                  percentage={amountInPercentage(
                    statistics.totalIncome.data.current,
                    statistics.totalExpense.data.current,
                    0,
                  )}
                />
              )}
              <TotalExpensesByIntervalCard
                isLoading={isStatisticsActionLoading('moneyFlow')}
                model={statistics.moneyFlow}
              />
              <NewCategoriesCard
                type={EXPENSE_TYPE}
                isLoading={isStatisticsActionLoading('expenseCategoriesTree')}
                model={statistics.expenseCategoriesTree}
              />
              <AccountExpenseDistributionCard
                isLoading={isStatisticsActionLoading('accountExpenseDistribution')}
                model={statistics.accountExpenseDistribution}
                onUpdate={(model) => setStatistics('accountExpenseDistribution', model)}
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <TotalExpense
                isLoading={isStatisticsActionLoading('totalExpense')}
                model={statistics.totalExpense}
              />
              <ExpenseCategoriesReviewCard
                isLoading={isStatisticsActionLoading('expenseCategoriesTree')}
                model={statistics.expenseCategoriesTree}
              />
              <ExpenseCategoriesByWeekdaysCard
                isLoading={isStatisticsActionLoading('expenseCategoriesByWeekdays')}
                model={statistics.expenseCategoriesByWeekdays}
                onUpdate={(model) => setStatistics('expenseCategoriesByWeekdays', model)}
              />
            </Col>
          </Row>
        </UncontrolledCollapse>

        <h3 id="food-expenses" className="cursor-pointer">Food expenses</h3>

        <UncontrolledCollapse defaultOpen toggler="#food-expenses">
          <Row>
            <Col xs={12} md={6} lg={3} className="order-last order-lg-first">
              <TotalInCategory
                category="Food"
                footerPeriod="year"
                footerType="amount"
                type={EXPENSE_TYPE}
                isLoading={isStatisticsActionLoading('foodExpenses')}
                model={statistics.foodExpenses}
              />
            </Col>
            <Col xs={12} md={6} lg={3}>
              <MinMax
                isLoading={isStatisticsActionLoading('foodExpensesMinMax')}
                model={statistics.foodExpensesMinMax}
              />
            </Col>
            {statistics.groceriesAverage.data && (
              <Col xs={12} md={6} lg={3}>
                <Average
                  category="Groceries"
                  isLoading={isStatisticsActionLoading('groceriesAverage')}
                  model={statistics.groceriesAverage}
                />
              </Col>
            )}
            <Col xs={12} md={6} lg={3}>
              <DailyInCategory
                category="Food"
                type={EXPENSE_TYPE}
                isLoading={isStatisticsActionLoading('foodExpenses')}
                model={statistics.foodExpenses}
              />
            </Col>
          </Row>
        </UncontrolledCollapse>

        <h3 id="utility-expenses" className="cursor-pointer">Utilities</h3>

        <UncontrolledCollapse defaultOpen toggler="#utility-expenses">
          <UtilityCostsByIntervalCard
            isLoading={isStatisticsActionLoading('utilityCostsByInterval')}
            model={statistics.utilityCostsByInterval}
            onUpdate={(model) => setStatistics('utilityCostsByInterval', model)}
          />
        </UncontrolledCollapse>
      </section>

      <hr />

    </>
  );
};

Report.propTypes = {
  ui: PropTypes.object.isRequired,
  statistics: PropTypes.object.isRequired,
  setStatistics: PropTypes.func.isRequired,
  updateReport: PropTypes.func.isRequired,
  setPeriod: PropTypes.func.isRequired,
};

const mapStateToProps = ({ ui, report: statistics }) => ({ statistics, ui });

export default connect(mapStateToProps, {
  setStatistics,
  updateReport,
  setPeriod,
})(Report);
