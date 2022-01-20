import React, {
  useState, createContext, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { INITIAL_FORM_DATA } from 'src/constants/transactions';
import TransactionForm from 'src/containers/TransactionForm';

const TransactionFormContext = createContext();

export const useTransactionForm = () => useContext(TransactionFormContext);

const TransactionFormProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [model, setModel] = useState();
  const [submitFn, setSubmitFn] = useState();
  const [title, setTitle] = useState();

  const toggleForm = useCallback(({
    onSubmit,
    model = INITIAL_FORM_DATA,
    title = undefined,
  }) => {
    if (!onSubmit) {
      setIsOpen(false);
      setModel();
      setTitle();
      setSubmitFn();
    }

    setModel(model);
    setSubmitFn(() => onSubmit);
    setTitle(title);
    setIsOpen(!isOpen);
  }, []);

  return (
    <TransactionFormContext.Provider value={toggleForm}>
      { children }

      {submitFn && (
        <TransactionForm
          isOpen={isOpen}
          toggleModal={() => setIsOpen(!isOpen)}
          title={title}
          model={model}
          onSubmit={submitFn}
        />
      )}
    </TransactionFormContext.Provider>
  );
};

TransactionFormProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export default TransactionFormProvider;
