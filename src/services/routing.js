import find from 'lodash/find';
import { parse, stringify } from 'query-string';
import { matchPath } from 'react-router-dom';

import history from 'src/services/history';
import {
  ROUTE_ACCOUNTS,
  ROUTE_CATEGORIES,
  ROUTE_DASHBOARD,
  ROUTE_DEBTS,
  ROUTE_TEST_PAGE,
  ROUTE_TRANSACTIONS_CALENDAR,
  ROUTE_REPORT,
  ROUTE_PROFILE,
  ROUTE_TRANSACTIONS,
  ROUTE_TRANSFERS,
  ROUTE_CURRENCY_CONVERTER,
} from 'src/constants/routes';
import { EXPENSE_TYPE } from 'src/constants/transactions';
import AccountList from 'src/containers/AccountList';
import CategoryList from 'src/containers/CategoryList';
import Dashboard from 'src/containers/Dashboard';
import DebtList from 'src/containers/DebtList';
import TransactionsCalendar from 'src/containers/TransactionsCalendar';
import Report from 'src/containers/Report';
import TransactionList from 'src/containers/TransactionList';
import TransferList from 'src/containers/TransferList';
import CurrencyConverter from 'src/containers/CurrencyConverter';
import UserProfile from 'src/containers/UserProfile';
import { isDev } from 'src/services/common';
import TestPage from 'src/containers/TestPage';

import apiRoutes from 'src/fos_js_routes.json';
import Routing from 'src/services/router';

Routing.setRoutingData(apiRoutes);

export const routes = [
  {
    path: ROUTE_DASHBOARD,
    name: 'Dashboard',
    icon: 'mdi mdi-chart-donut-variant',
    element: Dashboard,
    isInSidebar: true,
  },
  {
    path: ROUTE_TRANSACTIONS,
    name: 'Transactions',
    icon: 'mdi mdi-format-list-bulleted',
    element: TransactionList,
    isInSidebar: false,
  },
  {
    path: ROUTE_DEBTS,
    name: 'Debts',
    icon: 'ion-ios-bookmarks',
    element: DebtList,
    isInSidebar: false,
  },
  {
    path: ROUTE_ACCOUNTS,
    name: 'Accounts',
    icon: 'mdi mdi-wallet-travel',
    element: AccountList,
    isInSidebar: true,
  },
  {
    path: ROUTE_TRANSFERS,
    name: 'Transfers',
    icon: 'ion-ios-swap',
    element: TransferList,
    isInSidebar: true,
  },
  {
    path: ROUTE_CATEGORIES,
    name: 'Categories',
    icon: 'ion-ios-pricetags',
    element: CategoryList,
    isInSidebar: true,
  },
  {
    path: ROUTE_PROFILE,
    name: 'User Profile',
    icon: 'fa fa-user',
    element: UserProfile,
    isInSidebar: false,
  },
  {
    path: ROUTE_TEST_PAGE,
    name: 'Test Page',
    icon: 'ion-ios-construct',
    element: TestPage,
    isInSidebar: isDev(),
  },
  {
    path: ROUTE_REPORT,
    name: 'Annual Report',
    icon: 'ion-ios-stats',
    element: Report,
    isInSidebar: true,
  },
  {
    path: ROUTE_TRANSACTIONS_CALENDAR,
    name: 'Calendar View',
    icon: 'ion-ios-calendar',
    element: TransactionsCalendar,
    isInSidebar: true,
  },
  {
    path: ROUTE_CURRENCY_CONVERTER,
    name: 'Currency Converter',
    icon: 'ion-ios-options',
    element: CurrencyConverter,
    isInSidebar: true,
  },
];

export const getBrandText = (path) => {
  const route = find(routes, (route) => isOnPath(route.path, path));

  return route ? route.name : 'Budget';
};

export const isOnPath = (pathname) => !!matchPath(history.location.pathname, pathname);

export const isOnDashboardPage = () => isOnPath(`/${ROUTE_DASHBOARD}`);
export const isOnTransfersPage = () => isOnPath(`/${ROUTE_TRANSFERS}`);
export const isOnTransactionsPage = () => isOnPath(`/${ROUTE_TRANSACTIONS}`);

export const getQueryParam = (queryString, key, callback = false) => {
  const parsed = parse(queryString);

  if (!parsed[key]) {
    return null;
  }

  return callback ? callback(parsed[key]) : parsed[key];
};

export const getTransactionListQueryParams = (queryString) => ({
  perPage: getQueryParam(queryString, 'perPage', parseInt),
  page: getQueryParam(queryString, 'page', parseInt),
  types: getQueryParam(queryString, 'types', (v) => (Array.isArray(v) ? v : [v])),
  from: getQueryParam(queryString, 'from'),
  to: getQueryParam(queryString, 'to'),
  accounts: getQueryParam(queryString, 'accounts', (v) => (Array.isArray(v) ? v : [v])),
  categories: getQueryParam(queryString, 'categories', (v) => (Array.isArray(v) ? v : [v])),
  withCanceled: getQueryParam(queryString, 'withCanceled', (v) => v === 'true'),
  onlyDrafts: getQueryParam(queryString, 'onlyDrafts', (v) => v === 'true'),
});

export const getTransferListQueryParams = (queryString) => ({
  from: getQueryParam(queryString, 'from'),
  to: getQueryParam(queryString, 'to'),
  perPage: getQueryParam(queryString, 'perPage', parseInt),
  page: getQueryParam(queryString, 'page', parseInt),
  accounts: getQueryParam(queryString, 'accounts', (v) => (Array.isArray(v) ? v : [v])),
  withCanceled: getQueryParam(queryString, 'withCanceled', (v) => v === 'true'),
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

  return `${ROUTE_TRANSACTIONS}?${queryParams}`;
};

export const generateLinkToAccountTransactionsPage = (account) => generateLinkToTransactionPage([], null, null, [account], []);

/**
 * @param {string=} from
 * @param {string=} to
 * @param {array=} accounts
 * @param {array=} categories
 */
export const generateLinkToExpenses = (from, to, accounts, categories) => generateLinkToTransactionPage([EXPENSE_TYPE], from, to, accounts, categories);

export default Routing;
