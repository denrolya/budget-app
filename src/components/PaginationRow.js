import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Button, Col, Row } from 'reactstrap';

import Pagination from 'src/models/Pagination';

const PaginationRow = ({ model, setPage }) => (
  <Row>
    <Col className="align-items-center">
      <p className="text-nowrap">
        <span className="d-none d-sm-inline">Page</span>
        {' '}
        {model.page}
        {' '}
        /
        {' '}
        {model.countPages()}
      </p>
    </Col>
    <Col className="text-right align-items-center text-nowrap">
      <Button
        color="danger"
        className={cn('btn-icon', {
          'btn-sm': !window.isMobile,
          'btn-simple': model.isFirstPage(),
        })}
        onClick={() => setPage(model.page - 1)}
        disabled={model.isFirstPage()}
      >
        <i className="ion-ios-arrow-back" aria-hidden />
      </Button>
      <Button
        color="danger"
        className={cn('btn-icon', {
          'btn-sm': !window.isMobile,
          'btn-simple': model.isLastPage(),
        })}
        onClick={() => setPage(model.page + 1)}
        disabled={model.isLastPage()}
      >
        <i className="ion-ios-arrow-forward" aria-hidden />
      </Button>
    </Col>
  </Row>
);

PaginationRow.propTypes = {
  model: PropTypes.instanceOf(Pagination).isRequired,
  setPage: PropTypes.func.isRequired,
};

export default memo(PaginationRow);
