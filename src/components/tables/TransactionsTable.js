import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Table, Badge, UncontrolledCollapse } from 'reactstrap';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import cn from 'classnames';

import MoneyValue from 'src/components/MoneyValue';
import PaginationRow from 'src/components/PaginationRow';
import TransactionRow from 'src/components/tables/TransactionRow';
import { MOMENT_VIEW_DATE_FORMAT, MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { isExpense } from 'src/utils/common';
import { isToday, isYesterday } from 'src/utils/datetime';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import Pagination from 'src/models/Pagination';

const TransactionsTable = ({
  showNote,
  showActions,
  showFullCategoryPath,
  size,
  data,
  pagination,
  totalValue,
  setPage,
  setPerPage,
  handleDelete,
  handleEdit,
}) => {
  const { code } = useBaseCurrency();
  const dates = useMemo(() => uniqBy(
    data.map(({ executedAt }) => executedAt.clone().startOf('day')),
    (date) => date.format(),
  ).sort((a, b) => a.isBefore(b)), [data]);

  return (
    <>
      {dates.map((date) => {
        const transactions = data.filter(({ executedAt }) => executedAt.clone().startOf('day').isSame(date));
        const totalDailyValue = sumBy(
          transactions.filter((t) => !isExpense(t)),
          ({ convertedValues }) => convertedValues[code],
        )
          - sumBy(
            transactions.filter((t) => isExpense(t)),
            ({ convertedValues }) => convertedValues[code],
          );

        return (
          <React.Fragment key={date}>
            <div
              className="text-nowrap cursor-pointer py-1 px-3 d-flex justify-content-between align-center card-transactions__date-header"
              id={`date-${date.format(MOMENT_DATE_FORMAT)}`}
            >
              <p
                className={cn('mb-0', {
                  'text-primary': isToday(date),
                  'text-info': isYesterday(date),
                })}
              >
                <i aria-hidden className="ion-ios-calendar" />
                {' '}
                <strong>
                  {isToday(date) && 'Today'}
                  {isYesterday(date) && 'Yesterday'}
                  {!isToday(date) && !isYesterday(date) && date.format(MOMENT_VIEW_DATE_FORMAT)}
                </strong>
              </p>
              <Badge pill className="float-right" color={totalDailyValue > 0 ? 'success' : 'danger'}>
                <MoneyValue bold amount={totalDailyValue} />
              </Badge>
            </div>
            <UncontrolledCollapse defaultOpen toggler={`date-${date.format(MOMENT_DATE_FORMAT)}`}>
              <Table className="table--border-top-0 mb-0" size={size}>
                <tbody>
                  {transactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      showNote={showNote}
                      showActions={showActions}
                      showFullCategoryPath={showFullCategoryPath}
                      transaction={transaction}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </Table>
            </UncontrolledCollapse>
          </React.Fragment>
        );
      })}

      {pagination && (
        <div className="px-3 py-1">
          <PaginationRow model={pagination} setPage={setPage} setPerPage={setPerPage} />

          <p className="text-muted text-right text-nowrap small">
            <strong>{pagination.count}</strong>
            {' '}
            transactions of total value:
            {' '}
            <span
              className={cn({
                'text-success': totalValue >= 0,
                'text-danger': totalValue < 0,
              })}
            >
              <MoneyValue bold amount={Math.abs(totalValue)} />
            </span>
          </p>
        </div>
      )}
    </>
  );
};

TransactionsTable.defaultProps = {
  showActions: true,
  showFullCategoryPath: true,
  showNote: true,
  size: 'sm',
  totalValue: 0,
};

TransactionsTable.propTypes = {
  data: PropTypes.array,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  pagination: PropTypes.instanceOf(Pagination),
  setPage: PropTypes.func,
  setPerPage: PropTypes.func,
  showActions: PropTypes.bool,
  showFullCategoryPath: PropTypes.bool,
  showNote: PropTypes.bool,
  size: PropTypes.string,
  totalValue: PropTypes.number,
};

export default TransactionsTable;
