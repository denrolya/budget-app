import PropTypes from 'prop-types';
import React from 'react';
import { Table, Badge, UncontrolledCollapse } from 'reactstrap';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import cn from 'classnames';

import MoneyValue from 'src/components/MoneyValue';
import PaginationRow from 'src/components/PaginationRow';
import TransactionRow from 'src/components/tables/TransactionRow';
import { MOMENT_VIEW_DATE_FORMAT, MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { isToday, isYesterday, isExpense } from 'src/services/common';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import Pagination from 'src/models/Pagination';

const TransactionsTable = ({
  size,
  data,
  pagination,
  totalValue,
  setPage,
  setPerPage,
  deleteTransaction,
  editTransaction,
}) => {
  const { code } = useBaseCurrency();
  const dates = uniqBy(
    data.map(({ executedAt }) => executedAt.clone().startOf('day')),
    (date) => date.format(),
  ).sort((a, b) => a.isBefore(b));

  return (
    <>
      {dates.map((date) => {
        const transactions = data.filter(({ executedAt }) => executedAt.clone().startOf('day').isSame(date));
        const sum = sumBy(
          transactions.filter((t) => !isExpense(t)),
          ({ convertedValues }) => convertedValues[code],
        )
          - sumBy(
            transactions.filter((t) => isExpense(t)),
            ({ convertedValues }) => convertedValues[code],
          );

        return (
          <React.Fragment key={date}>
            <p
              id={`date-${date.format(MOMENT_DATE_FORMAT)}`}
              className="text-nowrap text-white cursor-pointer p-1 pl-3"
              style={{
                backgroundColor: '#171928',
              }}
            >
              <span
                className={cn('font-15px', 'm-auto', {
                  'text-primary': isToday(date),
                  'text-success': isYesterday(date),
                })}
              >
                <i className="ion-md-calendar" aria-hidden />
                {' '}
                {isToday(date) && 'Today'}
                {isYesterday(date) && 'Yesterday'}
                {!isToday(date) && !isYesterday(date) && date.format(MOMENT_VIEW_DATE_FORMAT)}
              </span>
              {' '}
              <Badge pill className="float-right" color={sum > 0 ? 'success' : 'danger'}>
                <MoneyValue amount={sum} />
              </Badge>
            </p>
            <UncontrolledCollapse defaultOpen toggler={`date-${date.format(MOMENT_DATE_FORMAT)}`}>
              <Table className="table--border-top-0" size={size}>
                <tbody>
                  {transactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      handleEdit={editTransaction}
                      handleDelete={deleteTransaction}
                    />
                  ))}
                </tbody>
              </Table>
            </UncontrolledCollapse>
          </React.Fragment>
        );
      })}

      {pagination && (
        <>
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
              <u className="strong">
                <MoneyValue amount={Math.abs(totalValue)} />
              </u>
            </span>
          </p>
        </>
      )}
    </>
  );
};

TransactionsTable.defaultProps = {
  size: 'sm',
  totalValue: 0,
};

TransactionsTable.propTypes = {
  size: PropTypes.string,
  data: PropTypes.array,
  pagination: PropTypes.instanceOf(Pagination),
  totalValue: PropTypes.number,
  setPage: PropTypes.func,
  setPerPage: PropTypes.func,
  deleteTransaction: PropTypes.func,
  editTransaction: PropTypes.func,
};

export default TransactionsTable;
