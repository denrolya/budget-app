import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Button } from 'reactstrap';

import AccountName from 'src/components/AccountName';
import TransactionDate from 'src/components/TransactionDate';
import TransactionValue from 'src/components/TransactionValue';
import TransactionCategory from 'src/components/TransactionCategory';

const TransactionRow = ({
  transaction, showActions, showFullCategoryPath, onEdit, onDelete,
}) => {
  const {
    id, account, note, category, executedAt,
  } = transaction;

  return [
    <tr key={`transaction-row-data-${id}`}>
      <td className="text-nowrap">
        <div className="mb-1">
          <TransactionCategory showFullPath={showFullCategoryPath} category={category} />
        </div>

        <AccountName showName account={account} />
      </td>
      <td className="text-nowrap text-right fit">
        <div className="mb-1">
          <TransactionValue transaction={transaction} />
        </div>

        <TransactionDate showTimeIcon showDate={false} date={executedAt} />
      </td>
      {showActions && (
        <td className="text-right text-nowrap w-50px">
          <Button
            size="sm"
            aria-label="Edit transaction"
            className="btn-link px-2"
            color="warning"
            onClick={() => onEdit(transaction)}
          >
            <i aria-hidden className="tim-icons icon-pencil" />
          </Button>
          <Button
            size="sm"
            aria-label="Delete transaction"
            className="btn-link px-2"
            color="danger"
            onClick={() => onDelete(transaction)}
          >
            <i aria-hidden className="tim-icons icon-trash-simple" />
          </Button>
        </td>
      )}
    </tr>,
    note ? (
      <tr className="border-top-0 p-0">
        <td colSpan="100%" className="border-top-0 py-0 px-1">
          <p className="text-muted small">
            <i aria-hidden className="fa fa-comment-o" />
            :
            {note}
          </p>
        </td>
      </tr>
    ) : null,
  ];
};

TransactionRow.defaultProps = {
  showActions: true,
  showFullCategoryPath: true,
};

TransactionRow.propTypes = {
  transaction: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
  showFullCategoryPath: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default memo(TransactionRow);
