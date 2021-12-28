import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Masonry from 'react-masonry-css';
import { connect } from 'react-redux';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';
import { Row, Col } from 'reactstrap';

import { ANNUAL_REPORT_RANGES, MOMENT_DATE_FORMAT } from 'src/constants/datetime';

import { amountInPercentage, isActionLoading, rangeToString } from 'src/services/common';

import { setStatistics, updateReport, setPeriod } from 'src/store/actions/report';

import AccountExpenseDistributionCard from 'src/components/cards/statistics/AccountExpenseDistributionCard';
import ExpenseCategoriesByWeekdaysCard from 'src/components/cards/statistics/ExpenseCategoriesByWeekdaysCard';
import ExpenseCategoriesReviewCard from 'src/components/cards/statistics/ExpenseCategoriesReviewCard';
import NewExpenseCategoriesCard from 'src/components/cards/statistics/NewExpenseCategoriesCard';
import NewIncomeCategoriesCard from 'src/components/cards/statistics/NewIncomeCategoriesCard';
import PercentageSpentFromIncomeCard from 'src/components/cards/statistics/PercentageSpentFromIncomeCard';
import TotalExpensesByIntervalCard from 'src/components/cards/statistics/TotalExpensesByIntervalCard';
import UtilityCostsByIntervalCard from 'src/components/cards/statistics/UtilityCostsByIntervalCard';
import ExpenseCategoriesCard from 'src/components/cards/ExpenseCategoriesCard';
import MoneyFlowCard from 'src/components/cards/MoneyFlowCard';
import MoneyValue from 'src/components/MoneyValue';
import SimpleStatisticsCard from 'src/components/cards/statistics/SimpleStatisticsCard';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import IconStatisticsCard from 'src/components/cards/statistics/IconStatisticsCard';

/**
 * TODO: Expenses by season should be calculated taken from moneyflow
 * TODO: Go through each card and see if can be reduced
 */
const Report = ({ ui, statistics, updateReport, setStatistics, setPeriod }) => {
  useEffect(() => {
    updateReport();
  }, []);

  const isStatisticsActionLoading = (statisticsName) =>
    isActionLoading(ui[`REPORT_FETCH_STATISTICS_${upperCase(snakeCase(statisticsName))}`]);

  const { from, to } = statistics.mainExpenseCategoriesReview;
  const diffInDays = statistics.mainExpenseCategoriesReview.diffIn('days');
  const previousYear = from.year() - 1;

  return (
    <>
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

      <MoneyFlowCard
        isLoading={isStatisticsActionLoading('moneyFlow')}
        model={statistics.moneyFlow}
        onIntervalSelect={() => {}}
        onUpdate={(newModel) => setStatistics('moneyFlow', newModel)}
      />
      <hr />

      <div>
        <h1>Incomes</h1>
        <Masonry
          breakpointCols={{
            default: 3,
            700: 2,
            500: 1,
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          <SimpleStatisticsCard
            isLoading={isStatisticsActionLoading('totalIncomeExpense')}
            title="Total Income"
            content={
              <MoneyValue bold maximumFractionDigits={0} amount={statistics.totalIncomeExpense.data.current.income} />
            }
            footer={
              <AmountSinceLastPeriodMessage
                invertedColors
                period={`last year(${previousYear})`}
                previous={statistics.totalIncomeExpense.data.previous.income}
                current={statistics.totalIncomeExpense.data.current.income}
              />
            }
          />

          {statistics.mainIncomeSource.data && (
            <IconStatisticsCard
              title="Main income source"
              color="success"
              className="card--hover-expand"
              isLoading={isStatisticsActionLoading('mainIncomeSource')}
              content={statistics.mainIncomeSource.data.name}
              icon={statistics.mainIncomeSource.data.icon}
            />
          )}

          <SimpleStatisticsCard
            isLoading={isStatisticsActionLoading('totalIncomeExpense')}
            title="Daily income"
            content={
              <MoneyValue
                bold
                maximumFractionDigits={0}
                amount={statistics.totalIncomeExpense.data.current.income / diffInDays}
              />
            }
            footer={
              <AmountSinceLastPeriodMessage
                invertedColors
                period={`last year(${previousYear})`}
                previous={statistics.totalIncomeExpense.data.previous.income / diffInDays}
                current={statistics.totalIncomeExpense.data.current.income / diffInDays}
              />
            }
          />
        </Masonry>
        <NewIncomeCategoriesCard
          isLoading={isStatisticsActionLoading('newIncomeCategories')}
          model={statistics.newIncomeCategories}
          onUpdate={(model) => setStatistics('newIncomeCategories', model)}
        />
        <hr />
      </div>
      <div>
        <h1>Expenses</h1>

        <h3>General expenses</h3>

        <Masonry
          breakpointCols={{
            default: 3,
            700: 2,
            500: 1,
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          <SimpleStatisticsCard
            isLoading={isStatisticsActionLoading('totalIncomeExpense')}
            title="Total Expense"
            content={
              <MoneyValue bold maximumFractionDigits={0} amount={statistics.totalIncomeExpense.data.current.expense} />
            }
            footer={
              <AmountSinceLastPeriodMessage
                period={`last year(${previousYear})`}
                previous={statistics.totalIncomeExpense.data.previous.expense}
                current={statistics.totalIncomeExpense.data.current.expense}
              />
            }
          />

          <TotalExpensesByIntervalCard
            isLoading={isStatisticsActionLoading('totalExpensesByInterval')}
            model={statistics.totalExpensesByInterval}
            onUpdate={(model) => setStatistics('totalExpensesByInterval', model)}
          />

          <ExpenseCategoriesReviewCard
            isLoading={isStatisticsActionLoading('mainExpenseCategoriesReview')}
            model={statistics.mainExpenseCategoriesReview}
            onUpdate={(model) => setStatistics('mainExpenseCategoriesReview', model)}
          />

          {statistics.totalIncomeExpense.data.current.income && statistics.totalIncomeExpense.data.current.expense && (
            <PercentageSpentFromIncomeCard
              isLoading={isStatisticsActionLoading('totalIncomeExpense')}
              percentage={amountInPercentage(
                statistics.totalIncomeExpense.data.current.income,
                statistics.totalIncomeExpense.data.current.expense,
                0,
              )}
            />
          )}

          <AccountExpenseDistributionCard
            isLoading={isStatisticsActionLoading('accountExpenseDistribution')}
            model={statistics.accountExpenseDistribution}
            onUpdate={(model) => setStatistics('accountExpenseDistribution', model)}
          />

          <NewExpenseCategoriesCard
            key="newExpenseCategories"
            isLoading={isStatisticsActionLoading('newExpenseCategories')}
            model={statistics.newExpenseCategories}
            onUpdate={(model) => setStatistics('newExpenseCategories', model)}
          />

          <ExpenseCategoriesByWeekdaysCard
            isLoading={isStatisticsActionLoading('expenseCategoriesByWeekdays')}
            model={statistics.expenseCategoriesByWeekdays}
            onUpdate={(model) => setStatistics('expenseCategoriesByWeekdays', model)}
          />
        </Masonry>

        <ExpenseCategoriesCard
          showDailyAnnual
          isLoading={isStatisticsActionLoading('expenseCategoriesTree')}
          model={statistics.expenseCategoriesTree}
          onUpdate={(model) => setStatistics('expenseCategoriesTree', model)}
        />

        <h3>Food expenses</h3>

        <Row>
          <Col xs={12} md={6} lg={3} className="order-last order-lg-first">
            <SimpleStatisticsCard
              title="Food expenses"
              isLoading={isStatisticsActionLoading('foodExpenses')}
              content={<MoneyValue bold maximumFractionDigits={0} amount={statistics.foodExpenses.data.current} />}
              footer={
                <AmountSinceLastPeriodMessage
                  period={`last year(${previousYear})`}
                  previous={statistics.foodExpenses.data.previous}
                  current={statistics.foodExpenses.data.current}
                />
              }
            />
          </Col>
          <Col xs={12} md={6} lg={3}>
            <SimpleStatisticsCard
              title="Minimum & Maximum"
              isLoading={isStatisticsActionLoading('foodExpensesMinMax')}
              content={
                <>
                  <MoneyValue bold maximumFractionDigits={0} amount={statistics.foodExpensesMinMax.data.min.value} />
                  {' - '}
                  <MoneyValue bold maximumFractionDigits={0} amount={statistics.foodExpensesMinMax.data.max.value} />
                </>
              }
              footer={
                <>
                  {moment(statistics.foodExpensesMinMax.data.min.when).format('MMMM')}
                  {' - '}
                  {moment(statistics.foodExpensesMinMax.data.max.when).format('MMMM')}
                </>
              }
            />
          </Col>
          {statistics.groceriesAverage.data && (
            <Col xs={12} md={6} lg={3}>
              <SimpleStatisticsCard
                title="Average groceries bill"
                isLoading={isStatisticsActionLoading('groceriesAverage')}
                content={
                  <MoneyValue bold maximumFractionDigits={0} amount={statistics.groceriesAverage.data.average} />
                }
                footer={<>Mostly on {moment().isoWeekday(statistics.groceriesAverage.data.dayOfWeek).format('dddd')}</>}
              />
            </Col>
          )}
          <Col xs={12} md={6} lg={3}>
            <SimpleStatisticsCard
              title="Food expenses"
              isLoading={isStatisticsActionLoading('foodExpenses')}
              content={
                <MoneyValue bold maximumFractionDigits={0} amount={statistics.foodExpenses.data.current / diffInDays} />
              }
              footer={
                <AmountSinceLastPeriodMessage
                  period={`last year(${previousYear})`}
                  previous={statistics.foodExpenses.data.previous / diffInDays}
                  current={statistics.foodExpenses.data.current / diffInDays}
                />
              }
            />
          </Col>
        </Row>

        <h3>Utilities</h3>

        <UtilityCostsByIntervalCard
          isLoading={isStatisticsActionLoading('utilityCostsByInterval')}
          model={statistics.utilityCostsByInterval}
          onUpdate={(model) => setStatistics('utilityCostsByInterval', model)}
        />

        <hr />
      </div>
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

const mapStateToProps = ({ ui, report: { statistics } }) => ({
  statistics,
  ui,
});

export default connect(mapStateToProps, {
  setStatistics,
  updateReport,
  setPeriod,
})(Report);
