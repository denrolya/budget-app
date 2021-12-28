import TreeModel from 'tree-model';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { randomTransactionCategoriesTimelineData } from 'src/services/common';
import { randomMoneyFlowData } from 'src/services/moneyFlowChart';

export const AVAILABLE_STATISTICS = [
  'moneyFlow',
  'expenseCategoriesTree',
  'shortExpenseForGivenPeriod',
  'transactionCategoriesTimeline',
];

export const INITIAL_STATE = {
  expenseCategoriesTree: new TimeperiodStatistics({
    data: new TreeModel().parse({ name: 'All categories' }),
  }),
  transactionCategoriesTimeline: new TimeperiodIntervalStatistics({
    data: {
      data: randomTransactionCategoriesTimelineData(),
      categories: [1, 2, 4],
    },
  }),
  moneyFlow: new TimeperiodIntervalStatistics({
    data: randomMoneyFlowData(),
  }),
  shortExpenseForGivenPeriod: new TimeperiodStatistics({
    data: {
      current: {
        daily: 0,
        total: 0,
        food: 0,
        rent: 0,
      },
      previous: {
        daily: 0,
        total: 0,
        food: 0,
        rent: 0,
      },
    },
  }),
};
