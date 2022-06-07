import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRoutes, Navigate } from 'react-router-dom';

import { CURRENCIES } from 'src/constants/currency';
import BaseCurrencyContext from 'src/contexts/BaseCurrency';
import Layout from 'src/containers/Layout';
import {
  ROUTE_ACCOUNTS,
  ROUTE_CATEGORIES,
  ROUTE_CURRENCY_CONVERTER,
  ROUTE_DASHBOARD,
  ROUTE_DEBTS,
  ROUTE_LOGIN,
  ROUTE_PROFILE,
  ROUTE_REPORT,
  ROUTE_TEST_PAGE,
  ROUTE_TRANSACTIONS,
  ROUTE_TRANSACTIONS_CALENDAR,
  ROUTE_TRANSFERS,
} from 'src/constants/routes';
import Login from 'src/containers/Login';
import AccountList from 'src/containers/AccountList';
import CategoryList from 'src/containers/CategoryList';
import CurrencyConverter from 'src/containers/CurrencyConverter';
import Dashboard from 'src/containers/Dashboard';
import DebtList from 'src/containers/DebtList';
import Report from 'src/containers/Report';
import TestPage from 'src/containers/TestPage';
import TransactionList from 'src/containers/TransactionList';
import TransactionsCalendar from 'src/containers/TransactionsCalendar';
import TransferList from 'src/containers/TransferList';
import UserProfile from 'src/containers/UserProfile';
import AccountDetails from 'src/containers/AccountDetails';

const App = ({ isAuthenticated, baseCurrency }) => {
  const routes = useMemo(() => [
    {
      path: '/*',
      element: isAuthenticated ? <Layout /> : <Navigate to={ROUTE_LOGIN} />,
      children: [
        { path: ROUTE_DASHBOARD, element: <Dashboard /> },
        { path: ROUTE_TRANSACTIONS, element: <TransactionList /> },
        { path: ROUTE_DEBTS, element: <DebtList /> },
        {
          path: ROUTE_ACCOUNTS,
          element: <AccountList />,
          children: [
            { path: ':id', element: <AccountDetails /> },
          ],
        },
        { path: ROUTE_TRANSFERS, element: <TransferList /> },
        { path: ROUTE_CATEGORIES, element: <CategoryList /> },
        { path: ROUTE_PROFILE, element: <UserProfile /> },
        { path: ROUTE_TEST_PAGE, element: <TestPage /> },
        { path: ROUTE_REPORT, element: <Report /> },
        { path: ROUTE_TRANSACTIONS_CALENDAR, element: <TransactionsCalendar /> },
        { path: ROUTE_CURRENCY_CONVERTER, element: <CurrencyConverter /> },
        { path: '*', element: <Navigate to="/dashboard" /> },
      ],
    },
    {
      path: ROUTE_LOGIN,
      element: !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />,
    },
  ], [isAuthenticated]);

  return (
    <BaseCurrencyContext.Provider value={baseCurrency}>
      {useRoutes(routes)}
    </BaseCurrencyContext.Provider>
  );
};

App.defaultProps = {
  isAuthenticated: false,
};

App.propTypes = {
  baseCurrency: PropTypes.shape({
    code: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['fiat', 'crypto']).isRequired,
  }).isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = ({ auth: { user, isAuthenticated } }) => ({
  isAuthenticated,
  baseCurrency: CURRENCIES[user?.baseCurrency || 'EUR'],
});

export default connect(mapStateToProps)(App);
