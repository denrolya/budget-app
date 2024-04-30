import React, { useMemo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button, Nav, NavItem } from 'reactstrap';
import filter from 'lodash/filter';
import sumBy from 'lodash/sumBy';

import { isDev } from 'src/utils/common';
import MoneyValue from 'src/components/MoneyValue';
import {
  ROUTE_ACCOUNTS, ROUTE_CATEGORIES,
  ROUTE_CURRENCY_CONVERTER,
  ROUTE_DASHBOARD,
  ROUTE_DEBTS,
  ROUTE_REPORT,
  ROUTE_TEST_PAGE,
  ROUTE_TRANSACTIONS,
  ROUTE_TRANSACTIONS_CALENDAR, ROUTE_TRANSFERS,
} from 'src/constants/routes';
import { useActiveAccountsWithDefaultOrder } from 'src/contexts/AccountsContext';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import AccountName from 'src/components/AccountName';
import { CURRENCIES } from 'src/constants/currency';
import { switchCurrencyPrompt } from 'src/utils/prompts';

const Sidebar = ({
  totalDebt,
  isLoading,
  onCurrencySwitch,
  updateStatistics,
}) => {
  const accounts = useActiveAccountsWithDefaultOrder();
  const { symbol, code } = useBaseCurrency();
  const availableCurrencies = filter(CURRENCIES, ({ type }) => type === 'fiat');
  const totalAccountsValue = useMemo(
    () => sumBy(accounts, ({ convertedValues }) => convertedValues[code]),
    [accounts],
  );

  const visibleAccounts = useMemo(
    () => accounts.filter(({ isDisplayedOnSidebar }) => isDisplayedOnSidebar),
    [accounts],
  );

  const handleCurrencyChange = async (currency) => {
    const { isConfirmed } = await switchCurrencyPrompt(code, currency);

    if (!isConfirmed) {
      return;
    }

    await onCurrencySwitch(currency.code);
    await updateStatistics();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-wrapper py-3">
        <div className="d-flex justify-content-between pt-0 pb-3 px-3">
          {availableCurrencies.map((c) => (
            <Button
              color="info"
              className="btn-icon btn-simple btn-round ml-0 mr-2"
              key={c.symbol}
              active={c.symbol === symbol}
              disabled={c.symbol === symbol}
              onClick={() => handleCurrencyChange(c)}
            >
              <span className="text-white">{c.symbol}</span>
            </Button>
          ))}
        </div>
        <Nav className="mt-0">
          {isDev() && (
            <>
              <NavItem tag="li">
                <NavLink className="nav-link" to={ROUTE_TEST_PAGE}>
                  <i aria-hidden className="ion-ios-construct" />
                  <p>Test Page</p>
                </NavLink>
              </NavItem>
              <NavItem tag="li">
                <hr />
              </NavItem>
            </>
          )}
          <NavItem tag="li">
            <NavLink className="nav-link" to={ROUTE_DASHBOARD}>
              <i aria-hidden className="mdi mdi-chart-donut-variant" />
              <p>Dashboard</p>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <NavLink className="nav-link" to={ROUTE_REPORT}>
              <i aria-hidden className="ion-ios-stats" />
              <p>Annual report</p>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <hr />
          </NavItem>
          <NavItem tag="li">
            <NavLink className="nav-link" to={ROUTE_ACCOUNTS}>
              <i aria-hidden className="mdi mdi-wallet-travel" />
              <p>Accounts</p>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <NavLink className="nav-link" to={ROUTE_CATEGORIES}>
              <i aria-hidden className="ion-ios-pricetags" />
              <p>Categories</p>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <hr />
          </NavItem>
          <NavItem tag="li">
            <NavLink className="nav-link" to={ROUTE_TRANSACTIONS}>
              <i aria-hidden className="mdi mdi-format-list-bulleted" />
              <p className="text-capitalize">All Transactions</p>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <NavLink className="nav-link" to={ROUTE_TRANSACTIONS_CALENDAR}>
              <i aria-hidden className="ion-ios-calendar" />
              <p className="text-capitalize">Calendar View(beta)</p>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <NavLink className="nav-link" to={ROUTE_TRANSFERS}>
              <i aria-hidden className="ion-ios-swap" />
              <p className="text-capitalize">Transfers</p>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <hr />
          </NavItem>
          <NavItem tag="li">
            <NavLink className="nav-link" to={ROUTE_DEBTS}>
              <i aria-hidden className="ion-ios-bookmarks" />
              <span className="d-flex flex-column">
                <p className="text-capitalize text-nowrap">
                  Debts
                </p>
                { !isLoading && (
                  <MoneyValue
                    bold
                    maximumFractionDigits={0}
                    className={cn('font-size-larger', 'opacity-9', {
                      'text-success': totalDebt === 0,
                      'text-danger': totalDebt !== 0,
                    })}
                    amount={totalDebt}
                  />
                ) }
              </span>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <hr />
          </NavItem>
          {visibleAccounts.map((account) => (
            <NavItem tag="li" key={account.name}>
              <NavLink
                className={() => 'nav-link text-capitalize'}
                to={`${ROUTE_ACCOUNTS}/${account.id}`}
              >
                <AccountName showBalance account={account} />
              </NavLink>
            </NavItem>
          ))}
          <NavItem tag="li">
            <NavLink to={ROUTE_ACCOUNTS} className={() => 'nav-link text-capitalize'}>
              <i aria-hidden className="mdi mdi-wallet-travel" />

              <span className="d-flex flex-column">
                <p className="text-nowrap">All Accounts</p>
                {!isLoading && (
                  <MoneyValue
                    bold
                    maximumFractionDigits={0}
                    className={cn('font-size-larger', 'opacity-9', {
                      'text-danger': totalAccountsValue < 0,
                      'text-success': totalAccountsValue > 0,
                    })}
                    amount={totalAccountsValue}
                  />
                )}
              </span>
            </NavLink>
          </NavItem>
          <NavItem tag="li">
            <hr />
          </NavItem>
          <NavItem tag="li">
            <NavLink className="nav-link" to={ROUTE_CURRENCY_CONVERTER}>
              <i aria-hidden className="ion-ios-options" />
              <p>Currency converter</p>
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
  updateStatistics: PropTypes.func.isRequired,
  onCurrencySwitch: PropTypes.func.isRequired,
  totalDebt: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default Sidebar;
