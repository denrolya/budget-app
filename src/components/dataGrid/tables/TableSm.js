import React from 'react';
import { Table } from '@devexpress/dx-react-grid-bootstrap4';

const TableSm = ({ ...restProps }) => <Table.Table {...restProps} className="table-sm" />;

export default TableSm;
