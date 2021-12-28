import truncate from 'lodash/truncate';
import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';
import cn from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';

import TransactionCategory from 'src/components/TransactionCategory';

const CategoryWithNoteTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={({ row, value }) => (
      <>
        {!row && value}
        {row && (
          <div
            id={`transaction-category-cell-${row.id}`}
            className={cn({
              'cursor-info': !!row.note,
            })}
          >
            {row ? <TransactionCategory category={value} /> : value}
            {row.note && (
              <div>
                <small className="text-info opacity-7">{truncate(row.note, 100)}</small>
                <UncontrolledTooltip target={`transaction-category-cell-${row.id}`}>{row.note}</UncontrolledTooltip>
              </div>
            )}
          </div>
        )}
      </>
    )}
    {...props}
  />
);

export default CategoryWithNoteTypeProvider;
