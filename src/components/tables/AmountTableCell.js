import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { EXPENSE_TYPE } from 'src/constants/transactions';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import transactionsTypeType from 'src/types/transactionsType';

const AmountTableCell = ({ id, amount, type, currencySymbol, value }) => {
  const { symbol } = useBaseCurrency();
  const isExpense = type === EXPENSE_TYPE;

  return (
    <td
      id={`transaction-amount-${id}`}
      className={cn('text-right', 'text-currency', {
        'text-danger': isExpense,
        'text-success': !isExpense,
      })}
    >
      <span className="d-block text-currency font-weight-bold">
        {isExpense ? '-' : '+'} {currencySymbol} {amount}
      </span>
      {currencySymbol !== symbol && (
        <small className="d-block text-currency">
          {symbol} {value.toFixed(2)}
        </small>
      )}
    </td>
  );
};

AmountTableCell.propTypes = {
  id: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  type: transactionsTypeType.isRequired,
  value: PropTypes.number,
};

export default AmountTableCell;
