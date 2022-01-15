import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Template, Plugin, TemplateConnector, Getter,
} from '@devexpress/dx-react-core';
import { Button } from 'reactstrap';
import { Table, VirtualTable } from '@devexpress/dx-react-grid-bootstrap4';

const makeDictionary = (values, getKey) => values.reduce((acc, v) => {
  acc[getKey(v)] = v;
  return acc;
}, {});

const pluginDependencies = [{ name: 'Table' }];

const NAME_PATTERN = /.*Action$/;

const ActionColumns = ({ columns }) => {
  const columnDictionary = useMemo(() => makeDictionary(columns, ({ name }) => name), [columns]);
  const computeColumns = useCallback((columns, getters) => getters.tableColumns.map((tableColumn) => tableColumn), [columns]);
  const isActionTableCell = ({ tableRow, tableColumn }) => (tableRow.type === Table.ROW_TYPE || tableRow.type === VirtualTable.ROW_TYPE) && NAME_PATTERN.test(tableColumn?.column?.name);

  return (
    <Plugin name="ActionColumn" dependencies={pluginDependencies}>
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <Getter name="tableColumns" computed={computeColumns.bind(null, columnDictionary)} />
      <Template name="tableCell" predicate={isActionTableCell}>
        {(params) => (
          <TemplateConnector>
            {() => {
              const actionColumn = columnDictionary[params.tableColumn.column.name];

              /* eslint-disable react/jsx-props-no-spreading */
              return (
                <Table.Cell
                  {...params}
                  className="text-center"
                  column={params.tableColumn.column}
                  row={params.tableRow.row}
                >
                  <Button
                    size="sm"
                    className="btn-link px-0"
                    color={actionColumn.color}
                    aria-label={actionColumn.label}
                    onClick={() => actionColumn.onClick(params.tableRow.row)}
                  >
                    <i aria-hidden className={typeof actionColumn.icon === 'function' ? actionColumn.icon(params.tableRow.row) : actionColumn.icon} />
                  </Button>
                </Table.Cell>
              );
              /* eslint-enable react/jsx-props-no-spreading */
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
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
};

export default memo(ActionColumns);
