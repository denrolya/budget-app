import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
  UncontrolledTooltip,
} from 'reactstrap';

import AccountName from 'src/components/AccountName';
import MoneyValue from 'src/components/MoneyValue';
import TransactionDate from 'src/components/TransactionDate';
import { isExpense } from 'src/services/common';
import TransactionCategory from 'src/components/TransactionCategory';

const TransactionRow = ({ transaction, handleEdit, handleDelete }) => {
  const {
    id, account, amount, convertedValues, note, category, executedAt, canceledAt,
  } = transaction;

  return (
    <tr>
      <td className="fit text-nowrap d-none d-md-table-cell">
        <code className="mr-2">
          #
          {id}
        </code>
      </td>

      <td
        className={cn('fit', 'text-nowrap', {
          'opacity-6': !!canceledAt,
        })}
        id={`transaction-account-cell-${id}`}
      >
        <AccountName account={account} />

        <span className="text-muted font-size-smaller d-block d-md-none text-left">
          <TransactionDate showTimeIcon showDate={false} date={executedAt} />
        </span>
      </td>

      <td className="d-none d-md-table-cell">
        <TransactionCategory category={category} />
        { note && (
          <p className="text-info opacity-7 small">
            {note}
          </p>
        )}
      </td>

      <td
        className={cn('text-nowrap', 'text-right', 'text-md-center', 'w-130px', {
          'opacity-6': !!canceledAt,
        })}
      >
        <span
          className={cn('d-block', 'text-currency', {
            'text-danger': isExpense(transaction),
            'text-success': !isExpense(transaction),
          })}
        >
          {isExpense(transaction) ? '-' : '+'}
          {' '}
          <MoneyValue currency={account.currency} amount={amount} values={convertedValues} />
        </span>

        <small className="text-nowrap d-block d-md-none">
          <TransactionCategory category={category} />
        </small>
      </td>

      <td className="text-right d-none d-md-table-cell w-130px">
        <TransactionDate showTimeIcon showDate={false} date={executedAt} />
      </td>

      {(handleEdit || handleDelete) && (
        <td className="text-right text-nowrap w-50px">
          <UncontrolledButtonDropdown>
            <DropdownToggle caret className="btn-icon btn-link">
              <i className="tim-icons icon-settings-gear-63" aria-hidden />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>
                Actions [#
                {transaction.id}
                ]
              </DropdownItem>
              {handleEdit && (
                <DropdownItem disabled={!!canceledAt} onClick={() => handleEdit(transaction)}>
                  Edit
                </DropdownItem>
              )}
              {handleDelete && (
                <>
                  <DropdownItem divider />
                  <DropdownItem disabled={!canceledAt} onClick={() => console.log('restore transaction')}>
                    Restore
                  </DropdownItem>
                  <DropdownItem
                    disabled={!canceledAt}
                    onClick={() => handleDelete(transaction)}
                    className={cn({
                      'text-danger': canceledAt,
                    })}
                  >
                    Remove completely
                  </DropdownItem>
                  <DropdownItem
                    disabled={!!canceledAt}
                    onClick={() => handleDelete(transaction)}
                    className={cn({
                      'text-danger': !canceledAt,
                    })}
                  >
                    Cancel
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </td>
      )}
    </tr>
  );
};

TransactionRow.propTypes = {
  transaction: PropTypes.object.isRequired,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default memo(TransactionRow);
