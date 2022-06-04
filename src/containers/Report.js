import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Helmet } from 'react-helmet';
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
const Report = ({
  ui,
  statistics,
  updateReport,
  setStatistics,
  setPeriod,
}) => {
  useEffect(() => {
    updateReport();
  }, []);

  const isStatisticsActionLoading = (statisticsName) => isActionLoading(ui[`REPORT_FETCH_STATISTICS_${upperCase(snakeCase(statisticsName))}`]);

  const { from, to } = statistics.mainExpenseCategoriesReview;
  const diffInDays = statistics.mainExpenseCategoriesReview.diffIn('days');
  const previousYear = from.year() - 1;
  const previousPeriodText = (previousYear === moment().year() - 1) ? `last year(${previousYear})` : previousYear;

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

      <MoneyFlowCard
        isLoading={isStatisticsActionLoading('moneyFlow')}
        model={statistics.moneyFlow}
        onIntervalSelect={() => {}}
        onUpdate={(newModel) => setStatistics('moneyFlow', newModel)}
      />
      <hr />

      <section>
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
            isLoading={isStatisticsActionLoading('totalIncome')}
            title="Total Income"
            content={
              <MoneyValue bold maximumFractionDigits={0} amount={statistics.totalIncome.data.current} />
            }
            footer={(
              <AmountSinceLastPeriodMessage
                invertedColors
                period={previousPeriodText}
                previous={statistics.totalIncome.data.previous}
                current={statistics.totalIncome.data.current}
              />
            )}
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
            isLoading={isStatisticsActionLoading('totalIncome')}
            title="Daily income"
            content={(
              <MoneyValue
                bold
                maximumFractionDigits={0}
                amount={statistics.totalIncome.data.current / diffInDays}
              />
            )}
            footer={(
              <AmountSinceLastPeriodMessage
                invertedColors
                period={previousPeriodText}
                previous={statistics.totalIncome.data.previous / diffInDays}
                current={statistics.totalIncome.data.current / diffInDays}
              />
            )}
          />
        </Masonry>
        <NewIncomeCategoriesCard
          isLoading={isStatisticsActionLoading('newIncomeCategories')}
          model={statistics.newIncomeCategories}
          onUpdate={(model) => setStatistics('newIncomeCategories', model)}
        />
        <hr />
      </section>
      <section>
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
            isLoading={isStatisticsActionLoading('totalExpense')}
            title="Total Expense"
            content={
              <MoneyValue bold maximumFractionDigits={0} amount={Math.abs(statistics.totalExpense.data.current)} />
            }
            footer={(
              <AmountSinceLastPeriodMessage
                period={previousPeriodText}
                previous={Math.abs(statistics.totalExpense.data.previous)}
                current={Math.abs(statistics.totalExpense.data.current)}
              />
            )}
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

          {statistics.totalIncome.data.current && statistics.totalExpense.data.current && (
            <PercentageSpentFromIncomeCard
              isLoading={isStatisticsActionLoading('totalExpense') || isStatisticsActionLoading('totalIncome')}
              percentage={amountInPercentage(
                statistics.totalIncome.data.current,
                Math.abs(statistics.totalExpense.data.current),
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
          onUpdate={(newModel) => setStatistics('expenseCategoriesTree', newModel)}
        />

        <h3>Food expenses</h3>

        <Row>
          <Col xs={12} md={6} lg={3} className="order-last order-lg-first">
            <SimpleStatisticsCard
              title="Food expenses"
              isLoading={isStatisticsActionLoading('foodExpenses')}
              content={<MoneyValue bold maximumFractionDigits={0} amount={Math.abs(statistics.foodExpenses.data.current)} />}
              footer={(
                <AmountSinceLastPeriodMessage
                  period={previousPeriodText}
                  previous={Math.abs(statistics.foodExpenses.data.previous)}
                  current={Math.abs(statistics.foodExpenses.data.current)}
                />
              )}
            />
          </Col>
          <Col xs={12} md={6} lg={3}>
            <SimpleStatisticsCard
              title="Minimum & Maximum"
              isLoading={isStatisticsActionLoading('foodExpensesMinMax')}
              content={(
                <>
                  <MoneyValue bold maximumFractionDigits={0} amount={statistics.foodExpensesMinMax.data.min.value} />
                  {' - '}
                  <MoneyValue bold maximumFractionDigits={0} amount={statistics.foodExpensesMinMax.data.max.value} />
                </>
              )}
              footer={(
                <>
                  {moment(statistics.foodExpensesMinMax.data.min.when).format('MMMM')}
                  {' - '}
                  {moment(statistics.foodExpensesMinMax.data.max.when).format('MMMM')}
                </>
              )}
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
                footer={(
                  <>
                    Mostly on
                    {' '}
                    {moment().isoWeekday(statistics.groceriesAverage.data.dayOfWeek).format('dddd')}
                  </>
                )}
              />
            </Col>
          )}
          <Col xs={12} md={6} lg={3}>
            <SimpleStatisticsCard
              title="Food expenses"
              isLoading={isStatisticsActionLoading('foodExpenses')}
              content={
                <MoneyValue bold maximumFractionDigits={0} amount={Math.abs(statistics.foodExpenses.data.current) / diffInDays} />
              }
              footer={(
                <AmountSinceLastPeriodMessage
                  period={previousPeriodText}
                  previous={Math.abs(statistics.foodExpenses.data.previous) / diffInDays}
                  current={Math.abs(statistics.foodExpenses.data.current) / diffInDays}
                />
              )}
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
      </section>

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

const mapStateToProps = ({ ui, report: statistics }) => ({
  statistics,
  ui,
});

export default connect(mapStateToProps, {
  setStatistics,
  updateReport,
  setPeriod,
})(Report);
