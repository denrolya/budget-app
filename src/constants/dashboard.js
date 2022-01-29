import { EXPENSE_TYPE } from 'src/constants/transactions';
import TreeModel from 'tree-model';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { randomMoneyFlowData, randomTransactionCategoriesTimelineData } from 'src/services/common';

export const AVAILABLE_STATISTICS = [{
  name: 'moneyFlow',
  path: 'api/transactions/statistics/money-flow',
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
  name: 'food',
  path: 'api/transactions/statistics/sum',
  additionalParams: {
    category_deep: [1],
    type: EXPENSE_TYPE,
  },
  fetchPreviousPeriod: true,
}, {
  name: 'rent',
  path: 'api/transactions/statistics/sum',
  additionalParams: {
    category_deep: [2, 18], // Rent, Utilities
    type: EXPENSE_TYPE,
  },
  fetchPreviousPeriod: true,
}, {
  name: 'expenseCategoriesTree',
  path: 'api/transactions/statistics/categories-tree',
  additionalParams: {
    type: EXPENSE_TYPE,
  },
  fetchPreviousPeriod: true,
}, {
  name: 'categoriesTimeline',
  path: 'api/transactions/statistics/categories-timeline',
}];

export const INITIAL_STATE = {
  moneyFlow: new TimeperiodIntervalStatistics({
    data: randomMoneyFlowData(),
  }),
  monthExpenses: new TimeperiodStatistics({
    data: {
      current: 0,
      previous: 0,
    },
  }),
  food: new TimeperiodStatistics({
    data: {
      current: 0,
      previous: 0,
    },
  }),
  rent: new TimeperiodStatistics({
    data: {
      current: 0,
      previous: 0,
    },
  }),
  expenseCategoriesTree: new TimeperiodStatistics({
    data: new TreeModel().parse({ name: 'All categories' }),
  }),
  categoriesTimeline: new TimeperiodIntervalStatistics({
    data: {
      data: randomTransactionCategoriesTimelineData(),
      categories: [1, 2, 4],
    },
  }),
};
