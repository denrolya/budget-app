import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const TransactionActions = ({
  isCanceled,
  onEdit,
  onRestore,
  onCancel,
  onDelete,
}) => (
  <>
    <Button size="sm" className="btn-link px-2" color="warning" disabled={isCanceled} onClick={onEdit}>
      <i aria-hidden className="tim-icons icon-pencil" />
    </Button>
    {!isCanceled && (
      <Button size="sm" className="btn-link px-2" color="warning" onClick={onCancel}>
        <i aria-hidden className="tim-icons icon-trash-simple" />
      </Button>
    )}
    {isCanceled && (
      <>
        <Button size="sm" className="btn-link px-2" color="success" onClick={onRestore}>
          <i aria-hidden className="tim-icons icon-refresh-01" />
        </Button>
        <Button size="sm" className="btn-link px-2" color="danger" onClick={onDelete}>
          <i aria-hidden className="tim-icons icon-simple-remove" />
        </Button>
      </>
    )}
  </>
);

TransactionActions.defaultProps = {
  isCanceled: false,
};

TransactionActions.propTypes = {
  isCanceled: PropTypes.bool,
  onEdit: PropTypes.func,
  onRestore: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
};

export default TransactionActions;
