import filter from 'lodash/filter';
import React, { memo, useMemo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { NavLink, useLocation, matchPath } from 'react-router-dom';
import { Button, Nav, NavItem } from 'reactstrap';
import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import Swal from 'sweetalert2';

import MoneyValue from 'src/components/MoneyValue';
import { ROUTE_ACCOUNTS, ROUTE_DEBTS, ROUTE_TRANSACTIONS } from 'src/constants/routes';
import { generateLinkToAccountTransactionsPage, routes } from 'src/services/routing';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import AccountName from 'src/components/AccountName';
import { CURRENCIES } from 'src/constants/currency';

const Sidebar = ({
  accounts, totalDebt, isLoading, onCurrencySwitch, updateDashboard,
}) => {
  const { pathname } = useLocation();
  const { symbol, code } = useBaseCurrency();
  const totalAccountsValue = useMemo(() => sumBy(accounts, ({ convertedValues }) => convertedValues[code]), [accounts]);
  const availableCurrencies = filter(CURRENCIES, ({ type }) => type === 'fiat');

  const visibleAccounts = useMemo(
    () => orderBy(accounts, 'name').filter(({ isDisplayedOnSidebar }) => isDisplayedOnSidebar),
    [accounts],
  );

  const handleCurrencyChange = async (currency) => {
    const { value } = await Swal.fire({
      icon: 'question',
      title: `Switch to ${currency.code} (${currency.symbol})`,
      text: 'You are switching base currency. Almost no changes in DB.',
      showCancelButton: true,
      confirmButtonText: `Switch to ${currency.code}`,
      cancelButtonText: `Keep ${code}`,
      confirmButtonClass: 'btn btn-warning',
      cancelButtonClass: 'btn btn-success',
      reverseButtons: true,
      buttonsStyling: false,
    });

    if (!value) {
      return;
    }

    await onCurrencySwitch(currency.code);
    updateDashboard();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-wrapper py-3">
        <div className="d-flex justify-content-between pt-0 pb-3 px-3">
          {availableCurrencies.map((c) => (
            <Button
              key={c.symbol}
              active={c.symbol === symbol}
              disabled={c.symbol === symbol}
              onClick={() => handleCurrencyChange(c)}
              color="info"
              className="btn-icon btn-simple btn-round ml-0 mr-2"
            >
              <span className="text-white">{c.symbol}</span>
            </Button>
          ))}
        </div>
        <Nav className="mt-0">
          {routes
            .filter(({ redirect, isInSidebar }) => !redirect && isInSidebar)
            .map(({ name, path, icon }) => (
              <NavItem tag="li" key={`nav-item-route-${name}`} active={!!matchPath(path, pathname)}>
                <NavLink className="nav-link text-white" to={path}>
                  <i aria-hidden className={icon} />
                  <p>{name}</p>
                </NavLink>
              </NavItem>
            ))}
          <NavItem tag="li">
            <hr />
          </NavItem>
          <NavItem tag="li" active={!!matchPath(ROUTE_TRANSACTIONS, pathname)}>
            <NavLink className="nav-link text-white" to={ROUTE_TRANSACTIONS}>
              <i aria-hidden className="mdi mdi-format-list-bulleted" />
              <p className="text-capitalize">All Transactions</p>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <hr />
          </NavItem>
          <NavItem tag="li" active={!!matchPath(ROUTE_DEBTS, pathname)}>
            <NavLink className="nav-link text-white" to={ROUTE_DEBTS}>
              <i aria-hidden className="ion-ios-bookmarks" />
              <p className="text-capitalize">
                Debts
                {' '}
                {!isLoading && (
                  <span
                    style={{ fontSize: 'larger' }}
                    className={cn({
                      'text-white': totalDebt === 0,
                      'text-danger': totalDebt !== 0,
                    })}
                  >
                    <MoneyValue bold amount={totalDebt} />
                  </span>
                )}
              </p>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <hr />
          </NavItem>
          {visibleAccounts.map((account) => (
            <NavItem tag="li" key={account.name}>
              <NavLink
                className="nav-link text-capitalize text-white"
                to={generateLinkToAccountTransactionsPage(account.id)}
              >
                <AccountName showBalance account={account} />
              </NavLink>
            </NavItem>
          ))}
          <NavItem tag="li" active={!!matchPath(ROUTE_ACCOUNTS, pathname)}>
            <NavLink className="nav-link text-capitalize text-white" to={ROUTE_ACCOUNTS}>
              <i aria-hidden className="mdi mdi-wallet-travel" />

              <div className="d-flex flex-column">
                <p className="text-nowrap">All Accounts</p>
                {!isLoading && (
                  <MoneyValue
                    bold
                    amount={totalAccountsValue}
                    className={cn('font-size-larger', {
                      'text-white': totalAccountsValue === 0,
                      'text-danger': totalAccountsValue < 0,
                      'text-success': totalAccountsValue > 0,
                    })}
                  />
                )}
              </div>
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    </div>
  );
};

Sidebar.defaultProps = {
  accounts: [],
  isLoading: false,
  totalDebt: 0,
};

Sidebar.propTypes = {
  updateDashboard: PropTypes.func.isRequired,
  onCurrencySwitch: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  totalDebt: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default memo(
  Sidebar,
  (pp, np) => isEqual(pp.accounts, np.accounts) && isEqual(pp.totalDebt, np.totalDebt) && pp.isLoading === np.isLoading,
);
