import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import AccountName from 'src/components/AccountName';
import AccountTypeahead from 'src/components/forms/fields/AccountTypeahead';

const AccountTypeProvider = (props) => {
  const formatterComponent = ({ row, value }) => (row ? <AccountName account={value} /> : value);
  const editorComponent = ({ value, onValueChange }) => (
    <AccountTypeahead
      allowNew
      multiple={false}
      onChange={([selected]) => onValueChange(selected ? selected.name : undefined)}
      selected={value ? [value] : []}
    />
  );
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <DataTypeProvider
      formatterComponent={formatterComponent}
      editorComponent={editorComponent}
      {...props}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
};

export default AccountTypeProvider;
