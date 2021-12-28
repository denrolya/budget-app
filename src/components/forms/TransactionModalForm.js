import React, { memo } from 'react';
import PropTypes from 'prop-types';

import ModalForm from 'src/components/forms/ModalForm';
import TransactionForm from 'src/components/forms/TransactionForm';

const TransactionModalForm = ({ isLoading, model, title, isOpen, onSubmit, toggleTransactionModal }) => (
  <ModalForm title={title} isOpen={isOpen} toggleModal={toggleTransactionModal}>
    <TransactionForm modelData={model} isLoading={isLoading} onSubmit={onSubmit} />
  </ModalForm>
);

TransactionModalForm.defaultProps = {
  title: 'New transaction',
};

TransactionModalForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleTransactionModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object,
  title: PropTypes.string,
};

export default memo(TransactionModalForm);
