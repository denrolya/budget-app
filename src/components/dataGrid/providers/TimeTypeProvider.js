import moment from 'moment-timezone';
import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import TransactionDate from 'src/components/TransactionDate';

const TimeTypeProvider = (props) => {
  const formatterComponent = ({ row }) => <TransactionDate showTimeIcon showDate={false} date={moment(row.executedAt)} />;

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <DataTypeProvider
      {...props}
      formatterComponent={formatterComponent}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
};

export default TimeTypeProvider;
