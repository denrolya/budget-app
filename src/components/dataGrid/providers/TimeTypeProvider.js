import moment from 'moment-timezone';
import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import TransactionDate from 'src/components/TransactionDate';

const TimeTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={({ row }) => <TransactionDate showTimeIcon showDate={false} date={moment(row.executedAt)} />}
    {...props}
  />
);

export default TimeTypeProvider;
