import { createSelector } from 'reselect';

import { isActionLoading } from 'src/utils/common';

const isListLoading = ({ ui }) => isActionLoading(ui.DEBT_FETCH_LIST);
const isTransactionsLoading = ({ ui }) => isActionLoading(ui.DEBT_FETCH_TRANSACTIONS_LIST);

export const getIsLoading = createSelector(
  [isListLoading, isTransactionsLoading],
  (isListLoading, isTransactionsLoading) => isListLoading || isTransactionsLoading,
);
