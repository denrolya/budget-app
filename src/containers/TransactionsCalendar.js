import React, { useEffect, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Pagination from 'src/models/Pagination';
import { fetchList, initializeList, resetPagination } from 'src/store/actions/transaction';
import Calendar from 'src/components/Calendar';
import MoneyValue from 'src/components/MoneyValue';
import { ROUTE_TRANSACTIONS_CALENDAR } from 'src/constants/routes';

const TransactionsCalendar = ({
  data, pagination, initializeList, fetchList,
}) => {
  const navigate = useNavigate();
  const firstUpdate = useRef(true);
  useEffect(() => {
    initializeList();

    return () => resetPagination();
  }, []);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    navigate(`${ROUTE_TRANSACTIONS_CALENDAR}?${pagination.getParamsQuery()}`);

    fetchList();
  }, [pagination.page, pagination.perPage, pagination.filters]);

  const titleAccessor = (t) => (
    <>
      <MoneyValue amount={t.amount} currency={t.account.currency} />
      {' '}
      from
      {t.account.name}
    </>
  );

  return (
    <Calendar
      events={data}
      startAccessor={({ executedAt }) => executedAt.toDate()}
      endAccessor={({ executedAt }) => executedAt.toDate()}
      titleAccessor={titleAccessor}
      eventPropGetter={({ account: { color } }) => ({
        style: {
          backgroundColor: `${color}80`,
        },
      })}
    />
  );
};

TransactionsCalendar.propTypes = {
  data: PropTypes.array.isRequired,
  pagination: PropTypes.instanceOf(Pagination).isRequired,
  fetchList: PropTypes.func.isRequired,
  initializeList: PropTypes.func.isRequired,
};

const mapStateToProps = ({ transaction }) => ({ ...transaction });

export default connect(mapStateToProps, {
  initializeList,
  fetchList,
})(TransactionsCalendar);
