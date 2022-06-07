import moment from 'moment-timezone';

export const initializeList = (transactions) => transactions.map(({ executedAt, canceledAt, ...rest }) => ({
  ...rest,
  executedAt: moment(executedAt),
  canceledAt: canceledAt ? moment(canceledAt) : null,
}));
