import React from 'react';
import moment from 'moment-timezone';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import TransactionDate from 'src/components/TransactionDate';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';

const DateTimeTypeProvider = (props) => {
  const formatterComponent = ({ row, value }) => row ? (
    <TransactionDate showTimeIcon date={value} />
  ) : (
    <TransactionDate showTime={false} date={moment(value, MOMENT_DATE_FORMAT)} />
  );

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <DataTypeProvider
      {...props}
      formatterComponent={formatterComponent}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
};

export default DateTimeTypeProvider;
