import cn from 'classnames';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table, UncontrolledButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';

import AccountName from 'src/components/AccountName';
import MoneyValue from 'src/components/MoneyValue';
import TransactionDate from 'src/components/TransactionDate';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { generateLinkToTransactionPage } from 'src/utils/routing';
import accountType from 'src/types/account';
import AccountBalance from 'src/components/charts/recharts/AccountBalance';

const AccountsTable = ({ accounts, handleArchivation }) => (
  <Table className="table--border-top-0">
    <tbody>
      {accounts.map((account) => (
        <tr
          key={account.id}
          className={cn({
            'opacity-6': account.value === 0,
          })}
        >
          <td className="fit text-nowrap d-none d-md-table-cell text-center">
            <code>
              #
              {account.id}
            </code>
          </td>

          <td className="fit text-nowrap">
            <AccountName account={account} />
          </td>
          <td>
            <AccountBalance account={account} />
          </td>

          <td className="text-right text-nowrap">
            <span
              className={cn('d-block', 'font-style-numeric', 'font-weight-bold', {
                'text-white': account.balance === 0,
                'text-danger': account.balance < 0,
                'text-success': account.balance > 0,
              })}
            >
              <MoneyValue showSign currency={account.currency} amount={account.balance} values={account.values} />
            </span>
            <span className="text-muted">
              <i aria-hidden className="ion-ios-create" />
              {' '}
              <span className="">
                <TransactionDate showTime date={moment(account.lastTransactionAt, MOMENT_DATETIME_FORMAT)} />
              </span>
            </span>
          </td>

          <td className="text-center text-nowrap w-50px">
            <UncontrolledButtonDropdown>
              <DropdownToggle caret className="btn-icon btn-link btn-simple" color="warning">
                <i className="tim-icons icon-settings-gear-63" aria-hidden />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>
                  <AccountName account={account} />
                </DropdownItem>
                <DropdownItem disabled={account.archivedAt} onClick={() => console.log('edit')}>
                  Edit
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag={Link} to={generateLinkToTransactionPage({ accounts: [account.name] })}>
                  List transactions
                </DropdownItem>
                <DropdownItem divider />
                {!account.archivedAt ? (
                  <DropdownItem className="text-danger" onClick={() => handleArchivation(account.id)}>
                    Archive
                  </DropdownItem>
                ) : (
                  <DropdownItem className="text-success" onClick={() => console.log('restore')}>
                    Restore
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

AccountsTable.propTypes = {
  accounts: PropTypes.arrayOf(accountType).isRequired,
  handleArchivation: PropTypes.func.isRequired,
};

export default AccountsTable;
