import moment from 'moment-timezone';

export const initializeList = (transactions) => transactions
  .map(({ executedAt, ...transaction }) => ({
    ...transaction,
    executedAt: moment(executedAt),
  }));
