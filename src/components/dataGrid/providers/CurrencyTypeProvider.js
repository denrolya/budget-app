import cn from 'classnames';
import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import { isExpense } from 'src/services/common';
import MoneyValue from 'src/components/MoneyValue';

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={({ row, value }) =>
      row ? (
        <span
          className={cn('text-currency', {
            'text-danger': isExpense(row),
            'text-success': !isExpense(row),
          })}
        >
          {isExpense(row) ? '-' : '+'}{' '}
          <MoneyValue currency={row.account.currency} amount={row.amount} values={row.values} />
        </span>
      ) : (
        <span
          className={cn('text-currency', {
            'text-danger': value <= 0,
            'text-success': value > 0,
          })}
        >
          <MoneyValue amount={value} />
        </span>
      )
    }
    {...props}
  />
);

export default CurrencyTypeProvider;
