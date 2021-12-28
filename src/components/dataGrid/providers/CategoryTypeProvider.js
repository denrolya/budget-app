import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import TransactionCategory from 'src/components/TransactionCategory';

const CategoryTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={({ row, value }) => (row ? <TransactionCategory category={value} /> : value)}
    {...props}
  />
);

export default CategoryTypeProvider;
