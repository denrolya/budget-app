import moment from 'moment-timezone';

export const initializeList = (transactions) => transactions.map(({ executedAt, ...rest }) => ({
  ...rest,
  executedAt: moment(executedAt),
}));
