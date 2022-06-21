import moment from 'moment-timezone';
import { ACCOUNT_TYPE_CASH } from 'src/constants/account';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TreeModel from 'tree-model';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { randomFloat, randomColor, randomMoneyFlowData } from 'src/utils/randomData';

const startOfYear = moment().startOf('year');
const endOfYear = moment().endOf('year');

export const AVAILABLE_STATISTICS = [
  {
    name: 'moneyFlow',
    path: 'api/transactions/statistics/money-flow',
  }, {
    name: 'foodExpenses',
    path: 'api/transactions/statistics/sum',
    additionalParams: {
      categoryDeep: [1],
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
    name: 'incomeCategoriesTree',
    path: 'api/categories/tree',
    additionalParams: {
      type: INCOME_TYPE,
    },
  }, {
    name: 'totalIncome',
    path: 'api/transactions/statistics/sum',
    additionalParams: {
      interval: '1 month',
      type: INCOME_TYPE,
    },
    fetchPreviousPeriod: true,
  }, {
    name: 'totalExpense',
    path: 'api/transactions/statistics/sum',
    additionalParams: {
      type: EXPENSE_TYPE,
    },
    fetchPreviousPeriod: true,
  }, {
    name: 'groceriesAverage',
    path: 'api/transactions/statistics/avg-weekly',
    additionalParams: {
      categoryDeep: [66],
      type: EXPENSE_TYPE,
    },
  }, {
    name: 'foodExpensesMinMax',
    path: 'api/transactions/statistics/min-max',
    additionalParams: {
      categoryDeep: [1],
      type: EXPENSE_TYPE,
    },
  }, {
    name: 'mainIncomeSource',
    path: 'api/transactions/statistics/top-value-category',
    additionalParams: {
      type: INCOME_TYPE,
    },
  }, {
    name: 'accountExpenseDistribution',
    path: 'api/transactions/statistics/account-distribution',
    additionalParams: {
      type: EXPENSE_TYPE,
    },
  }, {
    name: 'utilityCostsByInterval',
    path: 'api/transactions/statistics/categories-timeline',
    additionalParams: {
      interval: '3 months',
      categoryDeep: [4, 18, 132, 133],
      type: EXPENSE_TYPE,
    },
  },
  // 'newIncomeCategories',
  // 'newExpenseCategories',
  // 'expenseCategoriesByWeekdays',
];

export const INITIAL_STATE = {
  moneyFlow: new TimeperiodIntervalStatistics({
    from: startOfYear,
    to: endOfYear,
    data: randomMoneyFlowData(),
  }),
  mainIncomeSource: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: {
      // TEST DATA
      icon: 'ion-ios-download',
      name: 'Salary',
      value: randomFloat(),
    },
  }),
  accountExpenseDistribution: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: [
      {
        account: {
          id: 1,
          name: 'Cash (₴)',
          symbol: '₴',
          type: ACCOUNT_TYPE_CASH,
          currency: 'UAH',
          color: randomColor(),
        },
        value: randomFloat(),
        amount: randomFloat(),
      },
      {
        account: {
          id: 2,
          name: 'Cash ($)',
          symbol: '$',
          type: ACCOUNT_TYPE_CASH,
          currency: 'USD',
          color: randomColor(),
        },
        value: randomFloat(),
        amount: randomFloat(),
      },
    ],
  }),
  foodExpenses: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: {
      current: 0,
      previous: 0,
    },
  }),
  expenseCategoriesTree: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: new TreeModel().parse({ name: 'All categories' }),
  }),
  incomeCategoriesTree: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: new TreeModel().parse({ name: 'All categories' }),
  }),
  foodExpensesMinMax: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: {
      min: {
        value: 0,
        when: moment(),
      },
      max: {
        value: 0,
        when: moment(),
      },
    },
  }),
  groceriesAverage: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: {
      value: 0,
      dayOfWeek: 1,
    },
  }),
  mainExpenseCategoriesReview: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: [
      {
        icon: 'ion-ios-restaurant',
        name: 'Food & Drinks',
        current: randomFloat(),
        previous: randomFloat(),
      },
      {
        icon: 'ion-ios-home',
        name: 'Rent',
        current: randomFloat(),
        previous: randomFloat(),
      },
      {
        icon: 'ion-ios-home',
        name: 'Rent',
        current: randomFloat(),
        previous: randomFloat(),
      },
      {
        icon: 'mdi mdi-water-pump',
        name: 'Utilities',
        current: randomFloat(),
        previous: randomFloat(),
      },
      {
        icon: 'ion-ios-cart',
        name: 'Groceries',
        current: randomFloat(),
        previous: randomFloat(),
      },
      {
        icon: 'ion-ios-restaurant',
        name: 'Eating Out',
        current: randomFloat(),
        previous: randomFloat(),
      },
      {
        icon: 'ion-ios-paper',
        name: 'Tax',
        current: randomFloat(),
        previous: randomFloat(),
      },
      {
        icon: 'ion-ios-basket',
        name: 'Shopping',
        current: randomFloat(),
        previous: randomFloat(),
      },
    ],
  }),
  newIncomeCategories: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: [
      {
        name: 'Return on Investment',
        icon: 'ion-ios-repeat',
        value: randomFloat(),
        percentage: randomFloat(0, 100),
      },
      {
        name: 'Cashback',
        icon: 'ion-ios-repeat',
        value: randomFloat(),
        percentage: randomFloat(0, 100),
      },
    ],
  }),
  newExpenseCategories: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: [
      {
        name: 'Activities',
        icon: 'ion-ios-people',
        value: randomFloat(),
        percentage: randomFloat(0, 100),
      },
      {
        name: 'Education',
        icon: 'ion-ios-school',
        value: randomFloat(),
        percentage: randomFloat(0, 100),
      },
      {
        name: 'Fuel',
        icon: 'mdi mdi-fuel',
        value: randomFloat(),
        percentage: randomFloat(0, 100),
      },
    ],
  }),
  totalIncome: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: {
      current: randomFloat(),
      previous: randomFloat(),
    },
  }),
  totalExpense: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: {
      current: randomFloat(),
      previous: randomFloat(),
    },
  }),
  percentageSpentFromIncome: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: randomFloat(0, 100),
  }),
  dailyExpenseByCategories: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: {
      current: [
        {
          name: 'Food & Drinks',
          icon: 'ion-ios-restaurant',
          value: randomFloat(),
        },
        {
          name: 'Housing',
          icon: 'ion-ios-home',
          value: randomFloat(),
        },
        {
          name: 'Work Expense',
          icon: 'ion-ios-briefcase',
          value: randomFloat(),
        },
        {
          name: 'Unknown',
          icon: 'ion-ios-help-circle',
          value: randomFloat(),
        },
        {
          name: 'Transportation',
          icon: 'ion-ios-train',
          value: randomFloat(),
        },
        {
          name: 'Other',
          icon: 'ion-ios-pie',
          value: randomFloat(),
        },
        {
          name: 'Life & Entertainment',
          icon: 'ion-ios-body',
          value: randomFloat(),
        },
        {
          name: 'Shopping',
          icon: 'ion-ios-basket',
          value: randomFloat(),
        },
        {
          name: 'Health & Fitness',
          icon: 'ion-ios-pulse',
          value: randomFloat(),
        },
        {
          name: 'Vehicle',
          icon: 'ion-logo-model-s',
          value: randomFloat(),
        },
        {
          name: 'Financial expenses',
          icon: 'ion-ios-cash',
          value: randomFloat(),
        },
      ],
      previous: randomFloat(0, 100),
    },
  }),
  expenseCategoriesByWeekdays: new TimeperiodStatistics({
    from: startOfYear,
    to: endOfYear,
    data: [1, 2, 3, 4, 5, 6, 7].map((day) => ({
      name: moment().isoWeekday(day).format('dddd'),
      values: ['Food & Drinks',
        'Housing',
        'Work Expense',
        'Unknown',
        'Transportation',
        'Other',
        'Life & Entertainment',
        'Shopping',
        'Health & Fitness',
        'Vehicle',
        'Financial expenses'].map((cat) => ({
        [cat]: randomFloat(),
      })),
    })),
  }),
  utilityCostsByInterval: new TimeperiodIntervalStatistics({
    interval: '3 months',
    data: {
      Utilities: [1, 2, 3, 4].map(() => ({
        date: '',
        value: randomFloat(),
      })),
      Gas: [1, 2, 3, 4].map(() => ({
        date: '',
        value: randomFloat(),
      })),
      'Water utilities costs': [1, 2, 3, 4].map(() => ({
        date: '',
        value: randomFloat(),
      })),
      Electricity: [1, 2, 3, 4].map(() => ({
        date: '',
        value: randomFloat(),
      })),
    },
  }),
  totalExpensesByInterval: new TimeperiodIntervalStatistics({
    interval: 'quarter',
    data: [1, 2, 3, 4].map(() => randomFloat()),
  }),
};
