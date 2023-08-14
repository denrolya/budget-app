import { EXPENSE_TYPE } from 'src/constants/transactions';
import TreeModel from 'tree-model';
import moment from 'moment-timezone';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { randomTransactionCategoriesTimelineData } from 'src/utils/randomData';

export const AVAILABLE_STATISTICS = [{
  name: 'incomeExpense',
  path: 'api/transactions/statistics/income-expense',
}, {
  name: 'monthExpenses',
  path: 'api/transactions/statistics/sum',
  additionalParams: {
    type: EXPENSE_TYPE,
    'category.isAffectingProfit': true,
    isDraft: false,
  },
  fetchPreviousPeriod: true,
}, {
  name: 'foodExpenses',
  path: 'api/transactions/statistics/sum',
  additionalParams: {
    categoryDeep: [1],
    type: EXPENSE_TYPE,
  },
  fetchPreviousPeriod: true,
}, {
  name: 'rentUtilityExpenses',
  path: 'api/transactions/statistics/sum',
  additionalParams: {
    categoryDeep: [2, 18], // Rent, Utilities
    type: EXPENSE_TYPE,
  },
  fetchPreviousPeriod: true,
}, {
  name: 'expenseCategoriesTree',
  path: 'api/categories/tree',
  additionalParams: {
    type: EXPENSE_TYPE,
  },
}, {
  name: 'categoriesTimeline',
  path: 'api/transactions/statistics/categories-timeline',
}];

export const INITIAL_STATE = {
  incomeExpense: new TimeperiodStatistics({
    data: [],
    from: moment().subtract(6, 'month'),
    to: moment(),
  }),
  monthExpenses: new TimeperiodStatistics({
    data: {
      current: 0,
      previous: 0,
    },
  }),
  foodExpenses: new TimeperiodStatistics({
    data: {
      current: 0,
      previous: 0,
    },
  }),
  rentUtilityExpenses: new TimeperiodStatistics({
    data: {
      current: 0,
      previous: 0,
    },
  }),
  expenseCategoriesTree: new TimeperiodStatistics({
    data: new TreeModel().parse({
      name: 'All categories',
      total: 0,
      value: 0,
      previous: 0,
    }),
  }),
  categoriesTimeline: new TimeperiodIntervalStatistics({
    data: {
      data: randomTransactionCategoriesTimelineData(),
      categories: [1, 2, 4],
    },
  }),
};

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
