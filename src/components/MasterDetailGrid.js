import React from 'react';
import DataGrid from 'devextreme-react/data-grid';
import PropTypes from 'prop-types';

import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

const getMasterDetailGridDataSource = (id) => ({
  store: createStore({
    loadUrl: `${url}/OrderDetails`,
    loadParams: { orderID: id },
    onBeforeSend: (method, ajaxOptions) => {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  }),
});

const MasterDetailGrid = ({ data }) => {
  const dataSource = getMasterDetailGridDataSource(data.key);

  return <DataGrid showBorders dataSource={dataSource} />;
};

MasterDetailGrid.propTypes = {
  data: PropTypes.object,
};

export default MasterDetailGrid;
