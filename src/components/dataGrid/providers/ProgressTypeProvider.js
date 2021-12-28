import React from 'react';
import { Progress } from 'reactstrap';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

const generateColor = (percentage) => {
  let color = '';

  if (percentage !== 0 && percentage < 75) {
    color = 'success';
  } else if (percentage >= 75 && percentage <= 100) {
    color = 'warning';
  } else if (percentage > 100) {
    color = 'danger';
  }

  return color;
};

const ProgressTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={({ value }) => <Progress value={value} color={generateColor(value)} />}
    {...props}
  />
);

export default ProgressTypeProvider;
