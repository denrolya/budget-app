import React, { useMemo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button, Nav, NavItem } from 'reactstrap';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';

import MoneyValue from 'src/components/MoneyValue';
import { ROUTE_ACCOUNTS, ROUTE_DEBTS, ROUTE_TRANSACTIONS } from 'src/constants/routes';
import { useActiveAccounts } from 'src/contexts/AccountsContext';
import { generateLinkToAccountTransactionsPage, routes } from 'src/utils/routing';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import AccountName from 'src/components/AccountName';
import { CURRENCIES } from 'src/constants/currency';
import { switchCurrencyPrompt } from 'src/utils/prompts';

const Sidebar = ({
  totalDebt, isLoading, onCurrencySwitch, updateDashboard,
}) => {
  const accounts = useActiveAccounts();
  const { symbol, code } = useBaseCurrency();
  const availableCurrencies = filter(CURRENCIES, ({ type }) => type === 'fiat');
  const totalAccountsValue = useMemo(
    () => sumBy(accounts, ({ convertedValues }) => convertedValues[code]),
    [accounts],
  );

  const sidebarRoutes = useMemo(
    () => routes.filter(({ isInSidebar }) => isInSidebar),
    [routes],
  );

  const visibleAccounts = useMemo(
    () => orderBy(accounts, 'name').filter(({ isDisplayedOnSidebar }) => isDisplayedOnSidebar),
    [accounts],
  );

  const handleCurrencyChange = async (currency) => {
    const { isConfirmed } = await switchCurrencyPrompt(code, currency);

    if (!isConfirmed) {
      return;
    }

    await onCurrencySwitch(currency.code);
    await updateDashboard();
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
          {sidebarRoutes.map(({ name, path, icon }) => (
            <NavItem tag="li" key={`nav-item-route-${name}`}>
              <NavLink className="nav-link" to={path}>
                <i aria-hidden className={icon} />
                <p>{name}</p>
              </NavLink>
            </NavItem>
          ))}
          <NavItem tag="li">
            <hr />
          </NavItem>
          <NavItem tag="li">
            <NavLink to={ROUTE_TRANSACTIONS} className="nav-link text-capitalize">
              <i aria-hidden className="mdi mdi-format-list-bulleted" />
              <p className="text-capitalize">All Transactions</p>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <hr />
          </NavItem>
          <NavItem tag="li">
            <NavLink to={ROUTE_DEBTS} className="nav-link text-capitalize">
              <i aria-hidden className="ion-ios-bookmarks" />
              <p className="text-capitalize">
                Debts
                {' '}
                {!isLoading && (
                  <span
                    className={cn('font-size-larger', {
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
                className={() => 'nav-link text-capitalize'}
                to={generateLinkToAccountTransactionsPage(account.id)}
              >
                <AccountName showBalance account={account} />
              </NavLink>
            </NavItem>
          ))}
          <NavItem tag="li">
            <NavLink to={ROUTE_ACCOUNTS} className={() => 'nav-link text-capitalize'}>
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
  isLoading: false,
  totalDebt: 0,
};

Sidebar.propTypes = {
  updateDashboard: PropTypes.func.isRequired,
  onCurrencySwitch: PropTypes.func.isRequired,
  totalDebt: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default Sidebar;
