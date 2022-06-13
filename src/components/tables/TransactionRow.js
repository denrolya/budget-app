import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Button } from 'reactstrap';

import AccountName from 'src/components/AccountName';
import MoneyValue from 'src/components/MoneyValue';
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
}) => {
  const {
    id, account, amount, convertedValues, note, category, executedAt,
  } = transaction;

  return (
    <tr>
      <td className="text-nowrap d-none d-md-table-cell" style={{ width: '40px' }}>
        <code>
          #
          {id}
        </code>
      </td>

      <td className="fit text-nowrap text-truncate" id={`transaction-account-cell-${id}`}>
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

      <td className={cn('text-nowrap', 'text-right', 'text-md-center', 'w-130px')}>
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
          <Button size="sm" className="btn-link px-2" color="warning" onClick={() => onEdit(transaction)}>
            <i aria-hidden className="tim-icons icon-pencil" />
          </Button>
          <Button size="sm" className="btn-link px-2" color="danger" onClick={() => onDelete(transaction)}>
            <i aria-hidden className="tim-icons icon-trash-simple" />
          </Button>
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
};

export default memo(TransactionRow);
