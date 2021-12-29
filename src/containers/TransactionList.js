import PropTypes from 'prop-types';
import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { connect } from 'react-redux';
import {
  Button, Card, CardHeader, CardBody, Row, Collapse, Col,
} from 'reactstrap';

import TransactionFilters from 'src/components/TransactionFilters';
import TransactionModalForm from 'src/components/forms/TransactionModalForm';
import { isActionLoading } from 'src/services/common';
import { formatTransactionToFormType } from 'src/services/transaction';
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
import TransactionsGrid from 'src/components/dataGrid/TransactionsGrid';
import LoadingCard from 'src/components/cards/LoadingCard';

const TransactionList = ({
  isLoading,
  isTransactionEditInProgress,
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
  const [isEditModalOpened, setEditModalOpened] = useState(false);
  const [selectedTransaction, selectTransaction] = useState();
  const firstUpdate = useRef(true);
  const [isGridSelected, selectGrid] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(!window.isMobile);

  useEffect(() => {
    initializeList();

    return () => resetPagination();
  }, []);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    fetchList();
  }, [pagination.page, pagination.perPage, pagination.filters]);

  const toggleTransactionEdition = (transaction) => {
    selectTransaction(transaction);

    setEditModalOpened(!isEditModalOpened);
  };

  const handleTransactionEdition = (transaction) => editTransaction(transaction.id, transaction.type, formatTransactionToFormType(transaction));

  return (
    <>
      <Row>
        <Col xs={12} sm={12} md={8} lg={9}>
          <LoadingCard inverse isLoading={isLoading} className="card-transactions card-table mb-0">
            <CardBody className="p-0">
              { ((window.isDev && isGridSelected) || (!window.isDev && window.isMobile)) && (
                <TransactionsGrid
                  data={data}
                  pagination={pagination}
                  totalValue={totalValue}
                  setPage={setPage}
                  setPerPage={setPerPage}
                  setFilters={setFilters}
                  editTransaction={toggleTransactionEdition}
                  deleteTransaction={deleteTransaction}
                />
              ) }

              { ((window.isDev && !isGridSelected) || (!window.isDev && !window.isMobile)) && (
                <TransactionsTable
                  data={data}
                  pagination={pagination}
                  totalValue={totalValue}
                  setPage={setPage}
                  setPerPage={setPerPage}
                  setFilters={setFilters}
                  editTransaction={toggleTransactionEdition}
                  deleteTransaction={deleteTransaction}
                />
              )}

              {window.isDev && (
                <Button
                  block
                  color="primary"
                  size="sm"
                  className="btn-simple"
                  active={isGridSelected}
                  onClick={() => selectGrid(!isGridSelected)}
                >
                  Grid
                </Button>
              )}
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
                <TransactionFilters accounts={accounts} model={pagination.filters} onModelChange={setFilters} />
              </CardBody>
            </Collapse>
          </Card>
        </Col>
      </Row>

      {selectedTransaction && (
        <TransactionModalForm
          title={`Edit ${selectedTransaction.type} #${selectedTransaction.id}`}
          isLoading={isTransactionEditInProgress}
          onSubmit={handleTransactionEdition}
          model={selectedTransaction}
          isOpen={isEditModalOpened}
          toggleTransactionModal={() => setEditModalOpened(!isEditModalOpened)}
        />
      )}
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
  isTransactionEditInProgress: PropTypes.bool.isRequired,
  pagination: PropTypes.instanceOf(Pagination).isRequired,
  resetPagination: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  setPerPage: PropTypes.func.isRequired,
  totalValue: PropTypes.number.isRequired,
  accounts: PropTypes.array,
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ ui, account, transaction }) => ({
  ...transaction,
  accounts: account,
  isLoading:
    isActionLoading(ui.TRANSACTION_FETCH_LIST)
    || isActionLoading(ui.TRANSACTION_REGISTER)
    || isActionLoading(ui.TRANSACTION_DELETE)
    || isActionLoading(ui.TRANSACTION_EDIT),
  isTransactionEditInProgress: isActionLoading(ui.TRANSACTION_EDIT),
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