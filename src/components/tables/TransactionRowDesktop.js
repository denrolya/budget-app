import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import AccountName from 'src/components/AccountName';
import TransactionDate from 'src/components/TransactionDate';
import TransactionValue from 'src/components/TransactionValue';
import TransactionCategory from 'src/components/TransactionCategory';
import { generateLinkToTransactionPage } from 'src/utils/routing';

const TransactionRowDesktop = ({
  transaction, showActions, showFullCategoryPath, onEdit, onDelete,
}) => {
  const {
    id, account, note, category, executedAt,
  } = transaction;

  return [
    <tr key={`transaction-row-data-${id}`}>
      <td className="text-nowrap fit">
        <code>
          #
          {id}
        </code>
      </td>
      <td className="text-nowrap text-center fit">
        <Link
          className="text-body"
          to={generateLinkToTransactionPage({ categories: [category.id] })}
        >
          <TransactionCategory showFullPath={showFullCategoryPath} category={category} />
        </Link>
      </td>
      <td className="text-nowrap fit">
        <Link
          className="text-body"
          to={generateLinkToTransactionPage({ accounts: [account.id] })}
        >
          <AccountName showName account={account} />
        </Link>
      </td>
      <td>
        <p className="small mb-0 text-muted">
          <i aria-hidden className="fa fa-comment-o" />
          {`: ${note || 'No note'}`}
        </p>
      </td>
      <td className="fit">
        <TransactionValue transaction={transaction} />
      </td>
      <td className="fit">
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
  ];
};

TransactionRowDesktop.defaultProps = {
  showActions: true,
  showFullCategoryPath: true,
};

TransactionRowDesktop.propTypes = {
  transaction: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
  showFullCategoryPath: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default memo(TransactionRowDesktop);
