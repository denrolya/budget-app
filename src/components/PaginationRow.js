import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import {
  Button, Col, Row, Input,
} from 'reactstrap';

import Pagination from 'src/models/Pagination';

const PaginationRow = ({ model, setPage }) => (
  <div className="text-right align-items-center text-nowrap">
    <Button
      color="danger"
      className={cn('btn-icon', {
        'btn-sm': !window.isMobile,
        'btn-simple': model.isFirstPage(),
      })}
      onClick={() => setPage(1)}
      disabled={model.isFirstPage()}
    >
      <i aria-hidden className="mdi mdi-page-first" />
    </Button>
    <Button
      color="danger"
      className={cn('btn-icon', {
        'btn-sm': !window.isMobile,
        'btn-simple': model.isFirstPage(),
      })}
      onClick={() => setPage(model.page - 1)}
      disabled={model.isFirstPage()}
    >
      <i aria-hidden className="mdi mdi-chevron-left" />
    </Button>
    <Input
      disabled
      type="number"
      className="d-inline-block"
      style={{ maxWidth: 60 }}
      value={model.page}
      onChange={(e) => setPage(e.target.valueAsNumber)}
    />
    <Button
      color="danger"
      className={cn('btn-icon', {
        'btn-sm': !window.isMobile,
        'btn-simple': model.isLastPage(),
      })}
      onClick={() => setPage(model.page + 1)}
      disabled={model.isLastPage()}
    >
      <i aria-hidden className="mdi mdi-chevron-right" />
    </Button>
    <Button
      color="danger"
      className={cn('btn-icon', {
        'btn-sm': !window.isMobile,
        'btn-simple': model.isLastPage(),
      })}
      onClick={() => setPage(model.countPages())}
      disabled={model.isLastPage()}
    >
      <i aria-hidden className="mdi mdi-page-last" />
    </Button>
  </div>
);

PaginationRow.propTypes = {
  model: PropTypes.instanceOf(Pagination).isRequired,
  setPage: PropTypes.func.isRequired,
};

export default memo(PaginationRow);
