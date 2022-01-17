/* eslint-disable react/jsx-props-no-spreading, react/no-unstable-nested-components */

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import uniq from 'lodash/uniq';
import isNaN from 'lodash/isNaN';
import {
  Grid,
  Table,
  TableGroupRow,
  TableHeaderRow,
  DragDropProvider,
  GroupingPanel,
  PagingPanel,
  ColumnChooser,
  TableColumnVisibility,
  TableSummaryRow,
  TableColumnResizing,
  TableColumnReordering,
  Toolbar,
} from '@devexpress/dx-react-grid-bootstrap4';
import {
  SummaryState,
  PagingState,
  IntegratedSummary,
  CustomPaging,
  GroupingState,
  IntegratedGrouping,
  SortingState,
  IntegratedSorting,
} from '@devexpress/dx-react-grid';

import 'devextreme/dist/css/dx.common.css';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';

import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import Pagination from 'src/models/Pagination';
import IdTypeProvider from 'src/components/dataGrid/providers/IdTypeProvider';
import CurrencyTypeProvider from 'src/components/dataGrid/providers/CurrencyTypeProvider';
import DateTimeTypeProvider from 'src/components/dataGrid/providers/DateTimeTypeProvider';
import TimeTypeProvider from 'src/components/dataGrid/providers/TimeTypeProvider';
import TableSm from 'src/components/dataGrid/tables/TableSm';
import ActionColumns from 'src/components/dataGrid/columns/ActionsColumns';
import AccountTypeProvider from 'src/components/dataGrid/providers/AccountTypeProvider';
import CategoryWithNoteTypeProvider from 'src/components/dataGrid/providers/CategoryWithNoteTypeProvider';

const messages = {
  total: 'Total',
};

const TransactionsGrid = ({
  isGroupingEditable,
  isHeaderShown,
  data,
  pagination,
  totalValue,
  setPage,
  setPerPage,
  deleteTransaction,
  editTransaction,
}) => {
  const nameGroupCriteria = (value) => ({ key: value.name });
  const dateGroupCriteria = (value) => ({
    key: value.clone().format(MOMENT_DATE_FORMAT),
  });

  const [actionColumns] = useState([
    {
      name: 'editAction',
      label: 'Edit transaction',
      color: 'warning',
      onClick: editTransaction,
      icon: 'tim-icons icon-pencil',
    },
    {
      name: 'deleteAction',
      label: 'Delete\\Cancel transaction',
      color: 'danger',
      onClick: deleteTransaction,
      icon: ({ canceledAt }) => canceledAt ? 'tim-icons icon-trash-simple' : 'tim-icons icon-simple-remove',
    },
  ]);
  const [columns] = useState([
    { name: 'id', title: 'ID' },
    { name: 'account', title: 'Account' },
    { name: 'category', title: 'Category' },
    { name: 'amount', title: 'Amount' },
    { name: 'executedAt', title: 'When' },
    { name: 'executionTime', title: 'Time' },
    { name: 'editAction', title: ' ' },
    { name: 'deleteAction', title: ' ' },
  ]);
  const [columnOrder, setColumnOrder] = useState(columns.map(({ name }) => name));
  const [columnWidths, setColumnWidths] = useState([
    { columnName: 'id', width: '55' },
    { columnName: 'account', width: '100' },
    { columnName: 'category', width: '40%' },
    { columnName: 'amount', width: 'auto' },
    { columnName: 'executedAt', width: 'auto' },
    { columnName: 'executionTime', width: '100' },
    { columnName: 'editAction', width: '40' },
    { columnName: 'cancelAction', width: '30' },
    { columnName: 'deleteAction', width: '30' },
  ]);

  const [grouping, setGrouping] = useState([{ columnName: 'executedAt' }]);
  const [groupingStateColumnExtensions] = useState([
    { columnName: 'id', groupingEnabled: false },
    { columnName: 'executionTime', groupingEnabled: false },
    { columnName: 'editAction', groupingEnabled: false },
    { columnName: 'cancelAction', groupingEnabled: false },
    { columnName: 'deleteAction', groupingEnabled: false },
  ]);
  const [integratedGroupingColumnExtensions] = useState([
    { columnName: 'category', criteria: nameGroupCriteria },
    { columnName: 'account', criteria: nameGroupCriteria },
    { columnName: 'executedAt', criteria: dateGroupCriteria },
  ]);
  const [totalSummaryItems] = useState([{ columnName: 'amount', type: 'total' }]);
  const [tableColumnExtensions] = useState([
    { columnName: 'id', align: 'left' },
    { columnName: 'account', align: 'left' },
    { columnName: 'category', align: 'left' },
    { columnName: 'amount', align: 'center' },
    { columnName: 'executedAt', align: 'right' },
    { columnName: 'executionTime', align: 'right' },
    { columnName: 'editAction', align: 'center' },
    { columnName: 'cancelAction', align: 'center' },
    { columnName: 'deleteAction', align: 'center' },
  ]);

  const expandedExecutedAtGroups = useMemo(
    () => () => uniq(data.map(({ executedAt }) => moment(executedAt).format(MOMENT_DATE_FORMAT))),
    [data],
  );
  const [expandedGroups, setExpandedGroups] = useState(expandedExecutedAtGroups());
  const [hiddenColumnNames, setHiddenColumnNames] = useState(window.isMobile ? ['id'] : []);

  const groupColumns = (columns) => {
    const hasGroupingByExecutedAt = columns.some(({ columnName }) => columnName === 'executedAt');
    const executionTimeHiddenColumnIndex = hiddenColumnNames.find((e) => e === 'executionTime');

    if (hasGroupingByExecutedAt) {
      hiddenColumnNames.splice(executionTimeHiddenColumnIndex);
      setHiddenColumnNames(hiddenColumnNames);
      setExpandedGroups(expandedExecutedAtGroups());
    } else {
      setHiddenColumnNames([...hiddenColumnNames, 'executionTime']);
      setExpandedGroups([]);
    }

    setGrouping(columns);
  };

  useEffect(() => {
    if (grouping.some(({ columnName }) => columnName === 'executedAt')) {
      setExpandedGroups(expandedExecutedAtGroups());
    }
  }, [data]);

  // TODO: Refactor to useCallback ?
  const summaryCalculator = useMemo(
    () => (type, rows, getValue) => type === 'total' ? totalValue : IntegratedSummary.defaultCalculator(type, rows, getValue),
    [totalValue],
  );

  return (
    <Grid rows={data} columns={columns}>
      <DragDropProvider />

      <IdTypeProvider for={['id']} />
      <AccountTypeProvider for={['account']} />
      <CurrencyTypeProvider for={['amount']} />
      <CategoryWithNoteTypeProvider for={['category']} />
      <DateTimeTypeProvider for={['executedAt']} />
      <TimeTypeProvider for={['executionTime']} />

      {pagination ? (
        <PagingState
          currentPage={pagination.page - 1}
          onCurrentPageChange={(page) => setPage(page + 1)}
          pageSize={pagination.perPage}
          onPageSizeChange={setPerPage}
        />
      ) : null}

      {pagination ? <CustomPaging totalCount={pagination.count} /> : null}

      <SortingState defaultSorting={[{ columnName: 'executedAt', direction: 'desc' }]} />
      <IntegratedSorting />

      <GroupingState
        grouping={grouping}
        onGroupingChange={groupColumns}
        expandedGroups={expandedGroups}
        columnExtensions={groupingStateColumnExtensions}
        onExpandedGroupsChange={setExpandedGroups}
      />
      <IntegratedGrouping columnExtensions={integratedGroupingColumnExtensions} />

      <SummaryState totalItems={totalSummaryItems} />
      <IntegratedSummary calculator={summaryCalculator} />

      <Table columnExtensions={tableColumnExtensions} tableComponent={TableSm} />

      <TableColumnResizing
        onColumnWidthsChange={setColumnWidths}
        defaultColumnWidths={columnWidths}
        resizingMode="nextColumn"
      />

      <TableColumnReordering order={columnOrder} onOrderChange={setColumnOrder} />

      {isHeaderShown ? <Toolbar /> : null}
      {isHeaderShown ? <TableHeaderRow showSortingControls showGroupingControls /> : null}

      <TableGroupRow />

      <TableColumnVisibility hiddenColumnNames={hiddenColumnNames} onHiddenColumnNamesChange={setHiddenColumnNames} />

      {!isNaN(totalValue) ? <TableSummaryRow messages={messages} /> : null}

      {isHeaderShown ? (
        <ColumnChooser
          toggleButtonComponent={(params) => (
            <ColumnChooser.ToggleButton {...params} className="btn-sm btn-link btn-warning" />
          )}
        />
      ) : null}

      {isHeaderShown && isGroupingEditable ? (
        <GroupingPanel
          showGroupingControls
          showSortingControls
          itemComponent={(params) => <GroupingPanel.Item {...params} className="btn-group-sm" />}
        />
      ) : null}

      <ActionColumns columns={actionColumns} />

      {pagination && <PagingPanel pageSizes={pagination.perPageOptions} />}
    </Grid>
  );
};

TransactionsGrid.defaultProps = {
  data: [],
  isGroupingEditable: true,
  isHeaderShown: true,
  totalValue: 0,
};

TransactionsGrid.propTypes = {
  isHeaderShown: PropTypes.bool,
  isGroupingEditable: PropTypes.bool,
  data: PropTypes.array,
  pagination: PropTypes.instanceOf(Pagination),
  totalValue: PropTypes.number,
  setPage: PropTypes.func,
  setPerPage: PropTypes.func,
  deleteTransaction: PropTypes.func,
  editTransaction: PropTypes.func,
};

export default TransactionsGrid;
