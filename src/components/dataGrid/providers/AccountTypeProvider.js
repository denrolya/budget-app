import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import AccountName from 'src/components/AccountName';

const AccountTypeProvider = (props) => {
  const formatterComponent = ({ row, value }) => (row ? <AccountName account={value} /> : value);
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <DataTypeProvider
      formatterComponent={formatterComponent}
      {...props}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
};

export default AccountTypeProvider;
