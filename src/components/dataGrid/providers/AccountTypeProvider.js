import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import AccountName from 'src/components/AccountName';
import AccountTypeahead from 'src/components/forms/fields/AccountTypeahead';

const AccountTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={({ row, value }) => (row ? <AccountName account={value} /> : value)}
    editorComponent={({ value, onValueChange }) => (
      <AccountTypeahead
        allowNew
        multiple={false}
        onChange={([selected]) => onValueChange(selected ? selected.name : undefined)}
        selected={value ? [value] : []}
      />
    )}
    {...props}
  />
);

export default AccountTypeProvider;
