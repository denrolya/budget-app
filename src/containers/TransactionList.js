import PropTypes from 'prop-types';
import cn from 'classnames';
import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Collapse,
  Col,
} from 'reactstrap';

import NoTransactionsMessage from 'src/components/messages/NoTransactionsMessage';
import TransactionFilters from 'src/components/TransactionFilters';
import { useTransactionForm } from 'src/contexts/TransactionFormProvider';
import { isActionLoading } from 'src/services/common';
import {
  setPage,
  setPerPage,
  setPagination,
  resetPagination,
  deleteTransaction,
  setFilters,
  editTransaction,
  fetchList,
  initializeList,
} from 'src/store/actions/transaction';
import Pagination from 'src/models/Pagination';
import TransactionsTable from 'src/components/tables/TransactionsTable';
import LoadingCard from 'src/components/cards/LoadingCard';

const TransactionList = ({
  isLoading,
  data,
  totalValue,
  pagination,
  accounts,
  fetchList,
  initializeList,
  setFilters,
  setPage,
  setPerPage,
  resetPagination,
  editTransaction,
  deleteTransaction,
}) => {
  const { search } = useLocation();
  const firstUpdate = useRef(true);
  const toggleTransactionForm = useTransactionForm();
  const [isFiltersOpen, setIsFiltersOpen] = useState(!window.isMobile);

  useEffect(() => {
    if (search) {
      initializeList(search);
    }

    fetchList();

    return () => resetPagination();
  }, []);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    fetchList();
  }, [search]);

  const toggleTransactionEdition = (transaction) => toggleTransactionForm({
    model: transaction,
    title: `Edit ${transaction.type} #${transaction.id}`,
    onSubmit: ({ id, type, ...values }) => editTransaction(id, type, values),
  });

  return (
    <>
      <Helmet>
        <title>
          {`Transactions(${pagination.count}) | Budget`}
        </title>
      </Helmet>

      <Row>
        <Col xs={12} sm={12} md={8} lg={9}>
          <LoadingCard inverse className="card-transactions card-table mb-0" isLoading={isLoading}>
            <CardBody
              className={cn({
                'p-0': data.length > 0,
              })}
            >
              {data.length > 0 && (
                <TransactionsTable
                  data={data}
                  pagination={pagination}
                  totalValue={totalValue}
                  setPage={setPage}
                  setPerPage={setPerPage}
                  setFilters={setFilters}
                  handleEdit={toggleTransactionEdition}
                  handleDelete={deleteTransaction}
                />
              )}
              {data.length === 0 && <NoTransactionsMessage />}
            </CardBody>
          </LoadingCard>
        </Col>
        <Col xs={12} sm={12} md={4} lg={3} className="order-first order-md-last">
          <Card>
            <CardHeader>
              <h5 className="card-category cursor-pointer" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                <i className="ion-ios-funnel" aria-hidden />
                {' '}
                Filters
              </h5>
            </CardHeader>
            <Collapse isOpen={isFiltersOpen}>
              <CardBody>
                <TransactionFilters
                  accounts={accounts}
                  model={pagination.filters}
                  onModelChange={setFilters}
                />
              </CardBody>
            </Collapse>
          </Card>
        </Col>
      </Row>
    </>
  );
};

TransactionList.defaultProps = {
  accounts: [],
  isLoading: false,
};

TransactionList.propTypes = {
  data: PropTypes.array.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  editTransaction: PropTypes.func.isRequired,
  fetchList: PropTypes.func.isRequired,
  initializeList: PropTypes.func.isRequired,
  pagination: PropTypes.instanceOf(Pagination).isRequired,
  resetPagination: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  setPerPage: PropTypes.func.isRequired,
  totalValue: PropTypes.number.isRequired,
  accounts: PropTypes.array,
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({
  ui, account, transaction,
}) => ({
  ...transaction,
  accounts: account,
  isLoading:
    isActionLoading(ui.TRANSACTION_FETCH_LIST)
    || isActionLoading(ui.TRANSACTION_REGISTER)
    || isActionLoading(ui.TRANSACTION_DELETE)
    || isActionLoading(ui.TRANSACTION_EDIT),
});

export default connect(mapStateToProps, {
  initializeList,
  setFilters,
  setPagination,
  setPage,
  setPerPage,
  resetPagination,
  fetchList,
  editTransaction,
  deleteTransaction,
})(TransactionList);
