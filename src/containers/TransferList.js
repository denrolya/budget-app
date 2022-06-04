import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { useLayoutEffect, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import LoadingOverlay from 'react-loading-overlay';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, FormGroup, Row,
} from 'reactstrap';

import AddNewButton from 'src/components/AddNewButton';
import DateRange from 'src/components/forms/fields/DateRange';
import NoTransfersMessage from 'src/components/messages/NotTransfersMessage';
import PaginationRow from 'src/components/PaginationRow';
import TransfersTable from 'src/components/tables/TransfersTable';
import { isActionLoading } from 'src/services/common';
import {
  deleteTransfer,
  setFilters,
  setPage,
  setPerPage,
  resetPagination,
  fetchList,
  initializeList,
} from 'src/store/actions/transfer';
import { toggleTransferModal } from 'src/store/actions/ui';
import Pagination from 'src/models/Pagination';

const TransferList = ({
  isLoading,
  data,
  fetchList,
  initializeList,
  deleteTransfer,
  pagination,
  setPage,
  setPerPage,
  resetPagination,
  setFilters,
  toggleTransferModal,
}) => {
  const {
    filters: { from, to },
  } = pagination;

  useEffect(() => {
    initializeList();

    return () => resetPagination();
  }, []);

  useLayoutEffect(() => {
    fetchList();
  }, [pagination.page, pagination.perPage, pagination.filters]);

  const applyDateRangeFilter = (event, { startDate, endDate }) => setFilters(pagination.filters.setFromTo(startDate, endDate));

  return (
    <>
      <Helmet>
        <title>
          {`Transfers(${pagination.count}) | Budget`}
        </title>
      </Helmet>

      <Card>
        <LoadingOverlay spinner active={isLoading} className="h-100 overlay-rounded">
          <CardHeader>
            <Row>
              <Col xs={6} md={6} className="text-left">
                <CardTitle tag="h2">Transfers</CardTitle>
              </Col>
              <Col className="text-right">
                <AddNewButton onClick={toggleTransferModal} size="sm" />
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Form className="form transaction-filters mb-4">
              <FormGroup className="mb-0">
                <DateRange from={from} to={to} onApply={applyDateRangeFilter} />
              </FormGroup>
            </Form>
            {(!isLoading && data.size === 0) && <NoTransfersMessage />}

            {data.size > 0 && <TransfersTable data={data} deleteTransfer={deleteTransfer} />}
          </CardBody>

          <CardFooter className="pt-0">
            <PaginationRow model={pagination} setPage={setPage} setPerPage={setPerPage} />
          </CardFooter>
        </LoadingOverlay>
      </Card>
    </>
  );
};

TransferList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.instanceOf(Immutable.List).isRequired,
  deleteTransfer: PropTypes.func.isRequired,
  pagination: PropTypes.instanceOf(Pagination).isRequired,
  setPage: PropTypes.func.isRequired,
  setPerPage: PropTypes.func.isRequired,
  resetPagination: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  toggleTransferModal: PropTypes.func.isRequired,
  initializeList: PropTypes.func.isRequired,
  fetchList: PropTypes.func.isRequired,
};

const mapStateToProps = ({ transfer, ui }) => ({
  isLoading: isActionLoading(ui.TRANSFER_FETCH_LIST),
  data: transfer.data,
  pagination: transfer.pagination,
});

export default connect(mapStateToProps, {
  fetchList,
  initializeList,
  deleteTransfer,
  setFilters,
  setPage,
  setPerPage,
  resetPagination,
  toggleTransferModal,
})(TransferList);
