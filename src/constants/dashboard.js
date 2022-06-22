import { EXPENSE_TYPE } from 'src/constants/transactions';
import TreeModel from 'tree-model';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { randomMoneyFlowData, randomTransactionCategoriesTimelineData } from 'src/utils/randomData';

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
  moneyFlow: new TimeperiodIntervalStatistics({
    data: randomMoneyFlowData(),
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
    data: new TreeModel().parse({ name: 'All categories' }),
  }),
  categoriesTimeline: new TimeperiodIntervalStatistics({
    data: {
      data: randomTransactionCategoriesTimelineData(),
      categories: [1, 2, 4],
    },
  }),
};
