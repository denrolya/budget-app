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
    from: moment().subtract(1, 'month'),
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
