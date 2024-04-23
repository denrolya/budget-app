import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Badge, Button } from 'reactstrap';

import AccountName from 'src/components/AccountName';
import MoneyValue from 'src/components/MoneyValue';
import TransactionDate from 'src/components/TransactionDate';
import { isExpense } from 'src/utils/common';
import TransactionCategory from 'src/components/TransactionCategory';

const TransactionRow = ({
  transaction, showActions, showFullCategoryPath, showNote, onEdit, onDelete,
}) => {
  const {
    id, account, amount, convertedValues, note, category, executedAt,
  } = transaction;

  return [
    <tr>
      <td className="text-nowrap d-none d-md-table-cell fit">
        <code>
          #
          {id}
        </code>
      </td>

      <td className="d-none d-md-table-cell text-nowrap text-white fit">
        <AccountName showName account={account} />
      </td>

      <td className="text-nowrap text-truncate" id={`transaction-account-cell-${id}`}>
        <TransactionCategory showFullPath={showFullCategoryPath} category={category} />

        <span className="text-muted font-size-smaller d-block d-md-none text-left">
          <TransactionDate showTimeIcon showDate={false} date={executedAt} />
        </span>
      </td>

      <td className="text-nowrap fit">
        <Badge className="font-style-numeric" id={id} color={isExpense(transaction) ? 'danger' : 'success'}>
          {isExpense(transaction) ? '-' : '+'}
          {' '}
          <MoneyValue currency={account.currency} amount={amount} values={convertedValues} />
        </Badge>

        <small className="text-nowrap d-block d-md-none">
          <TransactionCategory showFullPath={showFullCategoryPath} category={category} />
        </small>
      </td>

      <td className="d-none d-md-table-cell fit">
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
    </tr>,
    showNote && note && (
      <tr className="border-top-0 p-0">
        <td colSpan="100%" className="border-top-0 py-0 px-1">
          <p className="text-muted small">
            <i className="fa fa-comment-o" aria-hidden="true" />
            :
            {note}
          </p>
        </td>
      </tr>
    ),
  ];
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
