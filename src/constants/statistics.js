import moment from 'moment-timezone';

export const INTERVALS = {
  '1d': {
    value: [moment().subtract(1, 'day'), moment()],
    tooltipDateFormat: 'DD MM YYYY hh:mm:ss',
    xTickFormat: 'ddd HH:00',
  },
  '1w': {
    value: [moment().subtract(1, 'week'), moment()],
    tooltipDateFormat: 'ddd Do MMM HH:00',
    xTickFormat: 'Do MMM',
  },
  '1m': {
    value: [moment().subtract(1, 'month'), moment()],
    tooltipDateFormat: 'ddd Do MMM',
    xTickFormat: 'Do MMM',
  },
  '3m': {
    value: [moment().subtract(3, 'months'), moment()],
    tooltipDateFormat: 'ddd Do MMM',
    xTickFormat: 'Do MMM',
  },
  '6m': {
    value: [moment().subtract(6, 'months'), moment()],
    tooltipDateFormat: 'ddd Do MMM',
    xTickFormat: 'Do MMM',
  },
  '1y': {
    value: [moment().subtract(1, 'year'), moment()],
    tooltipDateFormat: 'D.MM.YY',
    xTickFormat: 'Do MMM',
  },
  '2y': {
    value: [moment().subtract(2, 'years'), moment()],
    tooltipDateFormat: 'ddd Do MMM YY',
    xTickFormat: 'Do MMM',
  },
  '5y': {
    value: [moment().subtract(5, 'years'), moment()],
    tooltipDateFormat: 'ddd Do MMM YYYY',
    xTickFormat: 'Do MMM YY',
  },
  '10y': {
    value: [moment().subtract(10, 'years'), moment()],
    tooltipDateFormat: 'ddd Do MMM YYYY',
    xTickFormat: 'Do MMM YY',
  },
};

export const PATHS = {
  tree: 'api/v2/statistics/category/tree',
  timeline: 'api/v2/statistics/category/timeline',
  valueByPeriod: 'api/v2/statistics/value-by-period',
  accountDistribution: 'api/v2/statistics/account-distribution',
  transactionsValueByWeekdays: 'api/v2/statistics/by-weekdays',
  topValueCategory: 'api/v2/statistics/top-value-category',
  avg: 'api/v2/statistics/avg',
};

// TODO: Get rid of this. List should be dynamic
export const AVAILABLE_STATISTICS = [
  'totalExpenses',
  'dailyExpenses',
  'foodExpenses',
  'incomeExpense',
  'rentUtilityExpenses',
  'expenseCategoryTree',
  'categoriesTimeline',

  'moneyFlow',
  'totalIncomes',
  'dailyIncomes',
  'incomeCategoryTree',

  'totalFoodExpenses',
  'dailyFoodExpenses',
  'accountExpenseDistribution',
  'utilityGasExpenses',
  'utilityWaterExpenses',
  'utilityElectricityExpenses',
  'utilityExpenses',
  'expenseCategoriesByWeekdays',
  'topValueIncomeCategory',
  'foodMinMax',
  'groceriesAverage',
];
