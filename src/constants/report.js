import moment from 'moment-timezone';
import TreeModel from 'tree-model';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { randomFloat, randomColor } from 'src/services/common';
import { randomMoneyFlowData } from 'src/services/moneyFlowChart';

const startOfYear = moment().startOf('year');
const endOfYear = moment().endOf('year');

export const INITIAL_STATE = {
  statistics: {
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
        average: 0,
        dayOfWeek: 'Monday',
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
          percentage: randomFloat(),
        },
        {
          name: 'Cashback',
          icon: 'ion-ios-repeat',
          value: randomFloat(),
          percentage: randomFloat(),
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
          percentage: randomFloat(),
        },
        {
          name: 'Education',
          icon: 'ion-ios-school',
          value: randomFloat(),
          percentage: randomFloat(),
        },
        {
          name: 'Fuel',
          icon: 'mdi mdi-fuel',
          value: randomFloat(),
          percentage: randomFloat(),
        },
      ],
    }),
    totalIncomeExpense: new TimeperiodStatistics({
      from: startOfYear,
      to: endOfYear,
      data: {
        current: {
          expense: randomFloat(),
          income: randomFloat(),
        },
        previous: {
          expense: randomFloat(),
          income: randomFloat(),
        },
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
      data: {
        'Food & Drinks': {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(206, 34, 24, 0.6)',
        },
        Housing: {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(215, 252, 176, 0.6)',
        },
        'Work Expense': {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(43, 16, 40, 0.6)',
        },
        Unknown: {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(86, 2, 30, 0.6)',
        },
        Transportation: {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(50, 179, 143, 0.6)',
        },
        Other: {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(242, 198, 1, 0.6)',
        },
        'Life & Entertainment': {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(246, 215, 239, 0.6)',
        },
        Shopping: {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(120, 73, 207, 0.6)',
        },
        'Health & Fitness': {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(81, 217, 21, 0.6)',
        },
        Vehicle: {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(23, 234, 193, 0.6)',
        },
        'Financial expenses': {
          data: [1, 2, 3, 4, 5, 6, 7].map(() => randomFloat()),
          color: 'rgba(31, 78, 95, 0.6)',
        },
      },
    }),
    utilityCostsByInterval: new TimeperiodIntervalStatistics({
      interval: 'quarter',
      data: [
        {
          name: 'Utilities',
          icon: 'mdi mdi-water-pump',
          color: 'rgba(0, 242, 125, 1)',
          values: [1, 2, 3, 4].map(() => randomFloat()),
        },
        {
          name: 'Gas',
          icon: 'mdi mdi-radiator',
          color: 'rgba(255, 170, 0, 1)',
          values: [1, 2, 3, 4].map(() => randomFloat()),
        },
        {
          name: 'Water utilities costs',
          icon: 'mdi mdi-hand-water',
          color: 'rgba(80, 137, 249, 1)',
          values: [1, 2, 3, 4].map(() => randomFloat()),
        },
        {
          name: 'Electricity',
          icon: 'mdi mdi-flash-circle',
          color: 'rgba(210, 210, 42, 1)',
          values: [1, 2, 3, 4].map(() => randomFloat()),
        },
      ],
    }),
    totalExpensesByInterval: new TimeperiodIntervalStatistics({
      interval: 'quarter',
      data: [1, 2, 3, 4].map(() => randomFloat()),
    }),
  },
};
