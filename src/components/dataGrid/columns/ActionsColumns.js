import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Template, Plugin, TemplateConnector, Getter,
} from '@devexpress/dx-react-core';
import { Button } from 'reactstrap';
import { Table, VirtualTable, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';

const makeDictionary = (values, getKey) => values.reduce((acc, v) => {
  acc[getKey(v)] = v;
  return acc;
}, {});

const pluginDependencies = [{ name: 'Table' }];

const ACTION_COLUMN_TYPE = Symbol('ACTION_COLUMN');

const ActionColumns = ({ columns }) => {
  const columnDictionary = useMemo(() => makeDictionary(columns, ({ name }) => name), [columns]);

  const computeColumns = useCallback(
    (columns, getters) => getters.tableColumns.map((tableColumn) => {
      if (!tableColumn.column || !columns[tableColumn.column.name]) {
        return tableColumn;
      }
      return { ...tableColumn, type: ACTION_COLUMN_TYPE };
    }),
    [columns],
  );

  const isActionTableCell = ({ tableRow, tableColumn }) => (tableRow.type === Table.ROW_TYPE || tableRow.type === VirtualTable.ROW_TYPE)
    && tableColumn.type === ACTION_COLUMN_TYPE;

  const isActionTableHeader = ({ tableRow, tableColumn }) => tableRow.type === TableHeaderRow.ROW_TYPE && tableColumn.type === ACTION_COLUMN_TYPE;

  return (
    <Plugin name="ActionColumn" dependencies={pluginDependencies}>
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <Getter name="tableColumns" computed={computeColumns.bind(null, columnDictionary)} />
      <Template name="tableCell" predicate={isActionTableHeader}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(params) => <TemplateConnector>{() => <Table.StubHeaderCell {...params} />}</TemplateConnector>}
      </Template>
      <Template name="tableCell" predicate={isActionTableCell}>
        {(params) => (
          <TemplateConnector>
            {() => {
              const actionColumn = columnDictionary[params.tableColumn.column.name];

              return (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <Table.Cell {...params} className="text-center">
                  <Button
                    size="sm"
                    className="btn-link px-0"
                    color={actionColumn.color}
                    aria-label={actionColumn.label}
                    onClick={() => actionColumn.onClick(params.tableRow.row)}
                  >
                    <i className={actionColumn.icon} aria-hidden />
                  </Button>
                </Table.Cell>
              );
            }}
          </TemplateConnector>
        )}
      </Template>
    </Plugin>
  );
};

ActionColumns.defaultProps = {
  columns: [],
};

ActionColumns.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
};

export default memo(ActionColumns);
