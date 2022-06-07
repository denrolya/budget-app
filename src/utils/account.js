import pick from 'lodash/pick';
import sumBy from 'lodash/sumBy';
import React from 'react';
import moment from 'moment-timezone';

import { initializeList } from 'src/utils/transaction';
import { RAINBOW_COLORS } from 'src/constants/color';
import { amountInPercentage } from 'src/utils/common';
import { CURRENCIES } from 'src/constants/currency';

export const formatDetails = (data, baseCurrencyCode) => {
  const totalExpense = sumBy(data.topExpenseCategories, 'total');
  const totalIncome = sumBy(data.topIncomeCategories, 'total');
  return {
    totalExpense,
    totalIncome,
    ...data,
    logs: data.logs.map((log) => ({
      ...log,
      date: moment.unix(log.date),
    })),
    latestTransactions: initializeList(data.latestTransactions).map((t) => ({
      ...t,
      account: pick(data, ['id', 'name', 'type', 'icon', 'balance', 'color', 'currency']),
    })),
    topExpenseCategories: data.topExpenseCategories
      .filter((el) => el.total !== 0)
      .sort((a, b) => b.total - a.total)
      .map((v, k) => ({
        ...v,
        name: (<>
          {v.name}
          {' '}
          <b>
            {CURRENCIES[baseCurrencyCode].symbol}
            {v.total.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </b>
        </>),
        percentage: amountInPercentage(totalExpense, v.total),
        fill: RAINBOW_COLORS[k],
      })),
    topIncomeCategories: data.topIncomeCategories
      .filter((el) => el.total !== 0)
      .sort((a, b) => b.total - a.total)
      .map((v, k) => ({
        ...v,
        name: (<>
          {v.name}
          {' '}
          <b>
            {CURRENCIES[baseCurrencyCode].symbol}
            {v.total.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </b>
        </>),
        percentage: amountInPercentage(totalIncome, v.total),
        fill: RAINBOW_COLORS[RAINBOW_COLORS.length - 5 - k],
      })),
  };
};
