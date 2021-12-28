import pick from 'lodash/pick';
import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';

import { initializeList } from 'src/services/transaction';
import { RAINBOW_COLORS } from 'src/constants/charts';
import { amountInPercentage } from 'src/services/common';

export const formatDetails = (data, baseCurrencyCode) => {
  const totalExpense = sumBy(data.topExpenseCategories, 'total');
  const totalIncome = sumBy(data.topIncomeCategories, 'total');
  return {
    totalExpense,
    totalIncome,
    account: {
      ...data.account,
      logs: data.account.logs.map((log) => ({
        ...log,
        date: moment.unix(log.date),
      })),
      latestTransactions: initializeList(data.account.latestTransactions).map((t) => ({
        ...t,
        account: pick(data.account, ['id', 'name', 'type', 'icon', 'balance', 'color', 'currency']),
      })),
    },
    topExpenseCategories: data.topExpenseCategories
      .filter((el) => el.total !== 0)
      .sort((a, b) => b.total - a.total)
      .map((v, k) => ({
        ...v,
        name: `${v.name} ${v.total.toLocaleString(undefined, {
          style: 'currency',
          currency: baseCurrencyCode,
          maximumFractionDigits: 0,
        })}`,
        percentage: amountInPercentage(totalExpense, v.total),
        fill: RAINBOW_COLORS[k],
      })),
    topIncomeCategories: data.topIncomeCategories
      .filter((el) => el.total !== 0)
      .sort((a, b) => b.total - a.total)
      .map((v, k) => ({
        ...v,
        name: `${v.name} ${v.total.toLocaleString(undefined, {
          style: 'currency',
          currency: baseCurrencyCode,
          maximumFractionDigits: 0,
        })}`,
        percentage: amountInPercentage(totalIncome, v.total),
        fill: RAINBOW_COLORS[RAINBOW_COLORS.length - 5 - k],
      })),
  };
};
