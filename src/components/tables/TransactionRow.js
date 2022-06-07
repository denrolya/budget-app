import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';

import AccountName from 'src/components/AccountName';
import MoneyValue from 'src/components/MoneyValue';
import TransactionActions from 'src/components/tables/TransactionActions';
import TransactionDate from 'src/components/TransactionDate';
import { isExpense } from 'src/utils/common';
import TransactionCategory from 'src/components/TransactionCategory';

const TransactionRow = ({
  transaction,
  showActions,
  showFullCategoryPath,
  showNote,
  onEdit,
  onDelete,
  onCancel,
  onRestore,
}) => {
  const {
    id, account, amount, convertedValues, note, category, executedAt, canceledAt,
  } = transaction;

  const isCanceled = !!canceledAt;

  return (
    <tr>
      <td className="fit text-nowrap d-none d-md-table-cell">
        <code className="mr-2">
          #
          {id}
        </code>
      </td>

      <td
        id={`transaction-account-cell-${id}`}
        className={cn('fit', 'text-nowrap', {
          'text-muted': isCanceled,
        })}
      >
        <AccountName account={account} />

        <span className="text-muted font-size-smaller d-block d-md-none text-left">
          <TransactionDate showTimeIcon showDate={false} date={executedAt} />
        </span>
      </td>

      <td className="d-none d-md-table-cell">
        <TransactionCategory showFullPath={showFullCategoryPath} category={category} />
        { (showNote && note) && (
          <p className="text-muted small">
            {note}
          </p>
        )}
      </td>

      <td
        className={cn('text-nowrap', 'text-right', 'text-md-center', 'w-130px', {
          'text-muted': isCanceled,
        })}
      >
        <span
          className={cn('d-block', 'font-style-numeric', {
            'text-danger': isExpense(transaction),
            'text-success': !isExpense(transaction),
          })}
        >
          {isExpense(transaction) ? '-' : '+'}
          {' '}
          <MoneyValue currency={account.currency} amount={amount} values={convertedValues} />
        </span>

        <small className="text-nowrap d-block d-md-none">
          <TransactionCategory showFullPath={showFullCategoryPath} category={category} />
        </small>
      </td>

      <td className="text-right d-none d-md-table-cell w-130px">
        <TransactionDate showTimeIcon showDate={false} date={executedAt} />
      </td>

      {showActions && (
        <td className="text-right text-nowrap w-50px">
          <TransactionActions
            isCanceled={isCanceled}
            onEdit={() => onEdit(transaction)}
            onRestore={() => onRestore(transaction)}
            onDelete={() => onDelete(transaction)}
            onCancel={() => onCancel(transaction)}
          />
        </td>
      )}
    </tr>
  );
};

TransactionRow.defaultProps = {
  showNote: true,
  showActions: true,
  showFullCategoryPath: true,
};

TransactionRow.propTypes = {
  transaction: PropTypes.object.isRequired,
  showNote: PropTypes.bool,
  showActions: PropTypes.bool,
  showFullCategoryPath: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
  onRestore: PropTypes.func,
};

export default memo(TransactionRow);
