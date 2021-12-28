import React from 'react';
import moment from 'moment-timezone';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import TransactionDate from 'src/components/TransactionDate';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';

const DateTimeTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={({ row, value }) =>
      row ? (
        <TransactionDate showTimeIcon date={value} />
      ) : (
        <TransactionDate showTime={false} date={moment(value, MOMENT_DATE_FORMAT)} />
      )
    }
    {...props}
  />
);

export default DateTimeTypeProvider;
