import PropTypes from 'prop-types';
import React from 'react';

import debtType from 'src/types/debt';
import DebtTransactionForm from 'src/components/forms/DebtTransactionForm';
import ModalForm from 'src/components/forms/ModalForm';

const DebtTransactionModalForm = ({ isOpened, toggle, debt }) => (
  <ModalForm title={`Add new transaction to ${debt.debtor}'s debt`} isOpen={isOpened} toggleModal={toggle}>
    <DebtTransactionForm toggleModal={toggle} debt={debt} />
  </ModalForm>
);

DebtTransactionModalForm.propTypes = {
  debt: debtType.isRequired,
  isOpened: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default DebtTransactionModalForm;
