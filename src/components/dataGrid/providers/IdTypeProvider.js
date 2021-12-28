import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

const IdTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={({ value }) => <code>#{value}</code>} {...props} />
);

export default IdTypeProvider;
