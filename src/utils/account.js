import pick from 'lodash/pick';
import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';

import { initializeList } from 'src/utils/transaction';
import { RAINBOW_COLORS } from 'src/constants/color';
import { amountInPercentage } from 'src/utils/common';

export const formatDetails = (data) => {
  const totalExpense = sumBy(data.topExpenseCategories, 'total');
  const totalIncome = sumBy(data.topIncomeCategories, 'total');
  return {
    totalExpense,
    totalIncome,
    ...data,
    logs: data.logs.map((log) => ({
      ...log,
      createdAt: moment.unix(log.createdAt),
    })),
    latestTransactions: initializeList(data.latestTransactions).map((t) => ({
      ...t,
      account: pick(data, ['id', 'name', 'type', 'icon', 'balance', 'color', 'currency']),
    })).sort((a, b) => a.executedAt.isBefore(b.executedAt) ? 1 : -1),
    topExpenseCategories: data.topExpenseCategories
      .filter((el) => el.total !== 0)
      .sort((a, b) => b.total - a.total)
      .map((v, k) => ({
        ...v,
        percentage: amountInPercentage(totalExpense, v.total),
        fill: RAINBOW_COLORS[k],
      })),
    topIncomeCategories: data.topIncomeCategories
      .filter((el) => el.total !== 0)
      .sort((a, b) => b.total - a.total)
      .map((v, k) => ({
        ...v,
        percentage: amountInPercentage(totalIncome, v.total),
        fill: RAINBOW_COLORS[RAINBOW_COLORS.length - 5 - k],
      })),
  };
};
