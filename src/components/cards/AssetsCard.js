import cn from 'classnames';
import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  CardBody, CardFooter, Nav, NavItem, NavLink, TabContent, Table, TabPane,
} from 'reactstrap';

import LoadingCard from 'src/components/cards/LoadingCard';
import MoneyValue from 'src/components/MoneyValue';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import accountType from 'src/types/account';
import debtType from 'src/types/debt';

const AssetsCard = ({ isLoading, accounts, debts }) => {
  const totalAssetsValue = sumBy(accounts, 'value');
  const totalDebtValue = sumBy(debts, 'value');
  const [activeTab, toggleTab] = useState('assets');
  const { symbol } = useBaseCurrency();
  const tabs = ['assets', 'debts'];

  const AccountsTable = () => (
    <Table size="sm">
      <tbody>
        {orderBy(accounts, 'name').map(
          ({
            name, balance, value, values, currency,
          }) => Math.abs(value) >= 0.5 && (
            <tr key={`account-${name}`}>
              <td className="text-nowrap">{name}</td>
              <td className="text-right text-white text-nowrap">
                <MoneyValue currency={currency} amount={balance} values={values} />
              </td>
            </tr>
          ),
        )}
      </tbody>
    </Table>
  );

  const DebtsTable = () => (
    <Table size="sm">
      <tbody>
        {debts.map(({
          id, debtor, currency, balance, values,
        }) => (
          <tr key={`debt-${id}`}>
            <td>{debtor}</td>
            <td className="text-right text-white text-nowrap">
              <MoneyValue currency={currency} amount={balance} values={values} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <LoadingCard isLoading={isLoading} className="card-user">
      <CardBody>
        <div className="author">
          <div className="block block-one" />
          <div className="block block-two" />
          <div className="block block-three" />
          <div className="block block-four" />
        </div>
        <Nav pills className="nav-pills-primary justify-content-center">
          {tabs.map((tab) => (
            <NavItem key={tab}>
              <NavLink
                onClick={() => toggleTab(tab)}
                className={cn('text-capitalize', {
                  active: tab === activeTab,
                  'cursor-pointer': tab !== activeTab,
                })}
              >
                {tab}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <TabContent activeTab={activeTab} className="pt-4">
          <TabPane tabId="assets" className="table-responsive">
            <AccountsTable />
          </TabPane>
          <TabPane tabId="debts" className="table-responsive">
            <DebtsTable />
          </TabPane>
        </TabContent>
      </CardBody>
      <CardFooter className="pt-0">
        <Table>
          <tfoot>
            <tr>
              <td colSpan="2" className="text-right text-white font-weight-bold">
                {symbol}
                {' '}
                <span>{activeTab === 'assets' ? totalAssetsValue.toFixed(2) : totalDebtValue.toFixed(2)}</span>
              </td>
            </tr>
          </tfoot>
        </Table>
      </CardFooter>
    </LoadingCard>
  );
};

AssetsCard.defaultProps = {
  isLoading: false,
};

AssetsCard.propTypes = {
  accounts: PropTypes.arrayOf(accountType).isRequired,
  debts: PropTypes.arrayOf(debtType).isRequired,
  isLoading: PropTypes.bool,
};

export default AssetsCard;
