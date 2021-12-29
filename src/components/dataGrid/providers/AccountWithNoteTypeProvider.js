import React from 'react';
import cn from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import AccountName from 'src/components/AccountName';
import AccountTypeahead from 'src/components/forms/fields/AccountTypeahead';

const AccountWithNoteTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={({ row, value }) => row ? (
      <div
        id={`transaction-account-cell-${row.id}`}
        className={cn({
          'text-muted': !row.note,
          'text-white cursor-info': row.note,
        })}
      >
        <AccountName account={value} />
        {row.note && (
          <UncontrolledTooltip placement="right" target={`transaction-account-cell-${row.id}`}>
            {row.note}
          </UncontrolledTooltip>
        )}
      </div>
    ) : (
      value
    )}
    editorComponent={({ value, onValueChange }) => (
      <AccountTypeahead
        allowNew
        multiple={false}
        onChange={([selected]) => onValueChange(selected?.name)}
        selected={value ? [value] : []}
      />
    )}
    {...props}
  />
);

export default AccountWithNoteTypeProvider;
