import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Table, Badge } from 'reactstrap';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import cn from 'classnames';

import MoneyValue from 'src/components/MoneyValue';
import PaginationRow from 'src/components/PaginationRow';
import TransactionRowMobile from 'src/components/tables/TransactionRowMobile';
import { MOMENT_DATE_FORMAT, MOMENT_VIEW_DATE_FORMAT, MOMENT_VIEW_DATE_FORMAT_LONG } from 'src/constants/datetime';
import { isExpense } from 'src/utils/common';
import { isCurrentYear, isToday, isYesterday } from 'src/utils/datetime';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import Pagination from 'src/models/Pagination';

const TransactionsTableMobile = ({
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
  const uniqDates = useMemo(() => uniqBy(
    data.map(({ executedAt }) => executedAt.clone().startOf('day')),
    (date) => date.format(),
  ).sort((a, b) => a.isBefore(b)), [data]);

  return [
    <Table className="table--border-top-0 mb-0" size={size} key="transactions-table">
      <tbody>
        {uniqDates.map((date) => {
          const transactions = data.filter(({ executedAt }) => executedAt.clone().startOf('day').isSame(date));
          const expenses = transactions.filter((t) => isExpense(t));
          const incomes = transactions.filter((t) => !isExpense(t));

          const dailyExpense = sumBy(expenses, ({ convertedValues }) => convertedValues[code]);
          const dailyIncome = sumBy(incomes, ({ convertedValues }) => convertedValues[code]);
          const totalDailyValue = dailyIncome - dailyExpense;

          return [
            <tr className="bg-dark" key={`transaction-date-row-${date.format(MOMENT_DATE_FORMAT)}`}>
              <td className="text-nowrap px-1" colSpan="100%">
                <span
                  className={cn('mb-0', {
                    'text-primary': isToday(date),
                    'text-info': isYesterday(date),
                  })}
                >
                  <i aria-hidden className="ion-ios-calendar mr-1" />
                  {isToday(date) && 'Today'}
                  {isYesterday(date) && 'Yesterday'}
                  {(!isToday(date) && !isYesterday(date)) && date.format(isCurrentYear(date) ? MOMENT_VIEW_DATE_FORMAT : MOMENT_VIEW_DATE_FORMAT_LONG)}
                </span>

                <Badge pill color={totalDailyValue > 0 ? 'success' : 'danger'} className="float-right">
                  <MoneyValue showSign amount={totalDailyValue} />
                </Badge>
              </td>
            </tr>,

            ...transactions.map((transaction) => (
              <TransactionRowMobile
                key={`transaction-row-data-component-${transaction.id}`}
                showActions={showActions}
                showFullCategoryPath={showFullCategoryPath}
                transaction={transaction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )),
          ];
        })}
      </tbody>
    </Table>,

    pagination && (
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
    ),
  ];
};

TransactionsTableMobile.defaultProps = {
  showActions: true,
  showFullCategoryPath: true,
  size: 'sm',
  totalValue: 0,
};

TransactionsTableMobile.propTypes = {
  data: PropTypes.array,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  pagination: PropTypes.instanceOf(Pagination),
  setPage: PropTypes.func,
  setPerPage: PropTypes.func,
  showActions: PropTypes.bool,
  showFullCategoryPath: PropTypes.bool,
  size: PropTypes.string,
  totalValue: PropTypes.number,
};

export default TransactionsTableMobile;
