import { parse, stringify } from 'query-string';
import { matchPath } from 'react-router-dom';
import moment from 'moment-timezone';

import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import history from 'src/utils/history';
import {
  ROUTE_DASHBOARD,
  ROUTE_TRANSACTIONS,
  ROUTE_TRANSFERS,
} from 'src/constants/routes';
import { EXPENSE_TYPE } from 'src/constants/transactions';

export const isOnPath = (pathname) => !!matchPath(history.location.pathname, pathname);

export const isOnDashboardPage = () => isOnPath(`/${ROUTE_DASHBOARD}`);
export const isOnTransfersPage = () => isOnPath(`/${ROUTE_TRANSFERS}`);
export const isOnTransactionsPage = () => isOnPath(`/${ROUTE_TRANSACTIONS}`);

export const getQueryParam = (queryString, key, callback = false) => {
  const parsed = parse(queryString, {
    parseBooleans: true,
    parseNumbers: true,
  });

  if (!parsed[key]) {
    return null;
  }

  return callback ? callback(parsed[key]) : parsed[key];
};

export const getTransactionListQueryParams = (queryString) => ({
  perPage: getQueryParam(queryString, 'perPage'),
  page: getQueryParam(queryString, 'page'),
  types: getQueryParam(queryString, 'types', (v) => (Array.isArray(v) ? v : [v])),
  from: getQueryParam(queryString, 'from', (v) => moment(v, MOMENT_DATE_FORMAT)),
  to: getQueryParam(queryString, 'to', (v) => moment(v, MOMENT_DATE_FORMAT)),
  accounts: getQueryParam(queryString, 'accounts', (v) => (Array.isArray(v) ? v : [v])),
  categories: getQueryParam(queryString, 'categories', (v) => (Array.isArray(v) ? v : [v])),
  onlyDrafts: getQueryParam(queryString, 'onlyDrafts'),
});

export const getTransferListQueryParams = (queryString) => ({
  from: getQueryParam(queryString, 'from', (v) => moment(v, MOMENT_DATE_FORMAT)),
  to: getQueryParam(queryString, 'to', (v) => moment(v, MOMENT_DATE_FORMAT)),
  perPage: getQueryParam(queryString, 'perPage'),
  page: getQueryParam(queryString, 'page'),
  accounts: getQueryParam(queryString, 'accounts', (v) => (Array.isArray(v) ? v : [v])),
});

/**
 * @param {array} types
 * @param {string=} from
 * @param {string=} to
 * @param {array=} accounts
 * @param {array=} categories
 */
export const generateLinkToTransactionPage = (types, from, to, accounts, categories) => {
  const queryParams = stringify({
    types,
    from,
    to,
    categories,
    accounts,
  });

  return `/${ROUTE_TRANSACTIONS}?${queryParams}`;
};

export const generateLinkToAccountTransactionsPage = (account) => generateLinkToTransactionPage([], undefined, undefined, [account], []);

/**
 * @param {string=} from
 * @param {string=} to
 * @param {array=} accounts
 * @param {array=} categories
 */
export const generateLinkToExpenses = (from, to, accounts = [], categories = []) => generateLinkToTransactionPage([EXPENSE_TYPE], from, to, accounts, categories);
