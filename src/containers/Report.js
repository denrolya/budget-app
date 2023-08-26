import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import snakeCase from 'voca/snake_case';
import moment from 'moment-timezone';
import upperCase from 'voca/upper_case';
import { Row, Col, UncontrolledCollapse } from 'reactstrap';

import { ANNUAL_REPORT_RANGES, MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { INCOME_TYPE, EXPENSE_TYPE } from 'src/constants/transactions';

import { amountInPercentage, isActionLoading } from 'src/utils/common';
import { rangeToString } from 'src/utils/datetime';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';

import MainIncomeSourceCard from 'src/components/cards/statistics/icon/MainIncomeSourceCard';
import PercentageSpentFromIncomeCard from 'src/components/cards/statistics/icon/PercentageSpentFromIncomeCard';

import TotalValue from 'src/components/cards/statistics/generic/TotalValue';
import AverageInCategory from 'src/components/cards/statistics/generic/AverageInCategory';
import DailyInCategory from 'src/components/cards/statistics/generic/DailyInCategory';
import TotalInCategory from 'src/components/cards/statistics/generic/TotalInCategory';
import MinMax from 'src/components/cards/statistics/generic/MinMax';

import NewCategoriesCard from 'src/components/cards/statistics/NewCategoriesCard';

import AccountExpenseDistributionCard from 'src/components/cards/statistics/withCharts/AccountExpenseDistributionCard';
import ExpenseCategoriesByWeekdaysCard from 'src/components/cards/statistics/withCharts/ExpenseCategoriesByWeekdaysCard';
import TotalExpensesByIntervalCard from 'src/components/cards/statistics/withCharts/TotalExpensesByIntervalCard';
import ExpenseCategoriesReviewCard from 'src/components/cards/statistics/withCharts/ExpenseCategoriesReviewCard';
import CategoryTreeCard from 'src/components/cards/statistics/withCharts/CategoryTreeCard';
import MoneyFlowCard from 'src/components/cards/statistics/withCharts/MoneyFlowCard';
import { updateStatistics } from 'src/store/actions/ui';

const Report = ({ updateStatistics }) => {
  const [dateRange, setDateRange] = useState({
    after: moment().startOf('year'),
    before: moment().endOf('year'),
  });

  useEffect(() => () => {
    updateStatistics();
  }, [dateRange.after.format(), dateRange.before.format()]);

  const utilitiesCards = [
    <TotalValue
      config={{
        ...dateRange,
        interval: '1 month',
        name: 'utilityExpenses',
        categories: [18],
        footerType: 'chart',
      }}
    />,
    <TotalValue
      config={{
        ...dateRange,
        interval: '1 month',
        footerType: 'chart',
        name: 'utilityGasExpenses',
        categories: [4],
      }}
    />,
    <TotalValue
      config={{
        ...dateRange,
        interval: '1 month',
        name: 'utilityWaterExpenses',
        categories: [133],
        footerType: 'chart',
      }}
    />,
    <TotalValue
      config={{
        ...dateRange,
        interval: '1 month',
        name: 'utilityElectricityExpenses',
        categories: [132],
        footerType: 'chart',
      }}
    />,
  ];

  return (
    <>
      <Helmet>
        <title>
          {`${dateRange.after.year()} Report | Budget`}
        </title>
      </Helmet>

      <DateRangePicker
        autoApply
        showCustomRangeLabel
        alwaysShowCalendars={false}
        ranges={ANNUAL_REPORT_RANGES}
        locale={{ format: MOMENT_DATE_FORMAT }}
        startDate={dateRange.after}
        endDate={dateRange.before}
        onApply={(_event, { startDate, endDate }) => setDateRange({
          after: startDate,
          before: endDate,
        })}
      >
        <span className="cursor-pointer text-nowrap">
          <i aria-hidden className="ion-ios-calendar" />
          {'  '}
          {rangeToString(dateRange.after, dateRange.before, ANNUAL_REPORT_RANGES)}
        </span>
      </DateRangePicker>

      <section>
        <MoneyFlowCard
          showCalendarSwitch={false}
          config={{
            ...dateRange,
            name: 'moneyFlow',
            after: dateRange.after,
            before: dateRange.before,
          }}
        />
      </section>

      <hr />

      <section>
        <h1 id="incomes" className="cursor-pointer">Incomes</h1>
        <UncontrolledCollapse defaultOpen toggler="#incomes">
          <Row>
            <Col xs={12} md={6} lg={3}>
              <TotalValue
                config={{
                  ...dateRange,
                  name: 'totalIncomes',
                  footerType: 'percentage',
                  transactionType: INCOME_TYPE,
                }}
              />

              <TotalValue
                config={{
                  ...dateRange,
                  footerType: 'percentage',
                  type: 'daily',
                  name: 'dailyIncomes',
                  transactionType: INCOME_TYPE,
                }}
              />
            </Col>
            <Col xs={12} md={6} lg={6}>
              <CategoryTreeCard
                showDailyAnnual
                config={{
                  ...dateRange,
                  transactionType: INCOME_TYPE,
                  name: 'incomeCategoryTree',
                }}
              />
            </Col>
            <Col xs={12} md={6} lg={3}>
              {/* <MainIncomeSourceCard */}
              {/*  isLoading={isStatisticsActionLoading('incomeCategoriesTree')} */}
              {/*  model={statistics.incomeCategoriesTree} */}
              {/* /> */}
              {/* <NewCategoriesCard */}
              {/*  type={INCOME_TYPE} */}
              {/*  isLoading={isStatisticsActionLoading('incomeCategoriesTree')} */}
              {/*  model={statistics.incomeCategoriesTree} */}
              {/* /> */}
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
                config={{
                  ...dateRange,
                  transactionType: EXPENSE_TYPE,
                  name: 'expenseCategoryTree',
                }}
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              {/* <PercentageSpentFromIncomeCard */}
              {/*  isLoading={isStatisticsActionLoading('totalExpense') || isStatisticsActionLoading('totalIncome')} */}
              {/*  percentage={amountInPercentage( */}
              {/*    statistics.totalIncome.data.current, */}
              {/*    statistics.totalExpense.data.current, */}
              {/*    0, */}
              {/*  )} */}
              {/* /> */}
              {/* <TotalExpensesByIntervalCard */}
              {/*  isLoading={isStatisticsActionLoading('moneyFlow')} */}
              {/*  model={statistics.moneyFlow} */}
              {/* /> */}
              {/* <NewCategoriesCard */}
              {/*  type={EXPENSE_TYPE} */}
              {/*  isLoading={isStatisticsActionLoading('expenseCategoriesTree')} */}
              {/*  model={statistics.expenseCategoriesTree} */}
              {/* /> */}
              <AccountExpenseDistributionCard
                config={{ name: 'accountExpenseDistribution' }}
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <TotalValue
                config={{
                  ...dateRange,
                  footerType: 'percentage',
                  name: 'totalExpenses',
                  transactionType: EXPENSE_TYPE,
                }}
              />
              {/* <ExpenseCategoriesReviewCard */}
              {/*  isLoading={isStatisticsActionLoading('expenseCategoriesTree')} */}
              {/*  model={statistics.expenseCategoriesTree} */}
              {/* /> */}
              {/* <ExpenseCategoriesByWeekdaysCard */}
              {/*  isLoading={isStatisticsActionLoading('expenseCategoriesByWeekdays')} */}
              {/*  model={statistics.expenseCategoriesByWeekdays} */}
              {/*  onUpdate={(model) => setStatistics('expenseCategoriesByWeekdays', model)} */}
              {/* /> */}
            </Col>
          </Row>
        </UncontrolledCollapse>

        <h3 id="food-expenses" className="cursor-pointer">Food expenses</h3>

        <UncontrolledCollapse defaultOpen toggler="#food-expenses">
          <Row>
            <Col xs={12} md={6} lg={3} className="order-last order-lg-first">
              <TotalValue
                config={{
                  ...dateRange,
                  categories: [1],
                  footerType: 'percentage',
                  name: 'totalFoodExpenses',
                  transactionType: EXPENSE_TYPE,
                }}
              />
            </Col>
            <Col xs={12} md={6} lg={3}>
              {/* <MinMax */}
              {/*  isLoading={isStatisticsActionLoading('foodExpensesMinMax')} */}
              {/*  model={statistics.foodExpensesMinMax} */}
              {/* /> */}
            </Col>
            <Col xs={12} md={6} lg={3}>
              {/* <AverageInCategory */}
              {/*  title="Average groceries bill" */}
              {/*  category="Groceries" */}
              {/*  isLoading={isStatisticsActionLoading('groceriesAverage')} */}
              {/*  model={statistics.groceriesAverage} */}
              {/* /> */}
            </Col>
            <Col xs={12} md={6} lg={3}>
              <TotalValue
                config={{
                  ...dateRange,
                  type: 'daily',
                  footerType: 'percentage',
                  categories: [1],
                  name: 'dailyFoodExpenses',
                  transactionType: EXPENSE_TYPE,
                }}
              />
            </Col>
          </Row>
        </UncontrolledCollapse>

        <h3 id="utility-expenses" className="cursor-pointer">Utilities</h3>

        <UncontrolledCollapse defaultOpen toggler="#utility-expenses">
          <Row>
            {utilitiesCards.map((element) => (
              <Col key={`col-utilities-${element.props.config.name}`} xs={12} md={3}>
                {element}
              </Col>
            ))}
          </Row>
        </UncontrolledCollapse>
      </section>

      <hr />

    </>
  );
};

Report.propTypes = {
  updateStatistics: PropTypes.func.isRequired,
};

export default connect(null, { updateStatistics })(Report);
