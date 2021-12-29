import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

const IdTypeProvider = (props) => {
  const formatterComponent = ({ value }) => (
    <code>
      #
      {value}
    </code>
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

export default IdTypeProvider;
