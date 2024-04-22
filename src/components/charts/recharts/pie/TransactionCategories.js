import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import {
  Card, Table, Row, Col, Container,
} from 'reactstrap';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import PropTypes from 'prop-types';
import { MOMENT_VIEW_DATE_FORMAT, MOMENT_VIEW_DATE_FORMAT_SHORT } from 'src/constants/datetime';

import { amountInPercentage, expenseRatioColor } from 'src/utils/common';
import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/color';
import { generatePreviousPeriod } from 'src/utils/datetime';

const TransactionCategories = ({
  after, before, data, selectedCategory, onClick,
}) => {
  const [chartData, setChartData] = useState([]);
  const onSectorEnter = (_, index) => setActive(index);
  const [active, setActive] = useState();

  useEffect(() => {
    const selectedSubtree = data.first(({ model: { name } }) => name === selectedCategory);
    setChartData(
      selectedSubtree.children.map((node) => node.model).reverse(),
    );
  }, [data, selectedCategory]);

  const tooltipFormatter = ({ active, payload }) => {
    if (!active || !payload?.length) {
      return null;
    }

    const {
      previous, total, name, icon,
    } = payload[0].payload;
    const color = expenseRatioColor(amountInPercentage(previous, total, 0));
    const previousPeriod = generatePreviousPeriod(after, before, true);

    const dataTable = (sum) => (
      <Table size="sm" bordered={false} className="m-0">
        <tbody>
          <tr>
            <td className="text-left">Total</td>
            <td className="text-right">
              <MoneyValue bold className="text-white" amount={sum} maximumFractionDigits={0} />
            </td>
          </tr>
          {[
            ['days', 'Daily'],
            ['weeks', 'Weekly'],
            ['months', 'Monthly'],
            ['years', 'Annual'],
          ].map(([unitOfTime, title]) => {
            const diff = moment().isBetween(after, before)
              ? moment().diff(after, unitOfTime) + 1
              : before.diff(after, unitOfTime) + 1;

            return (diff > 1) && (
              <tr key={`${title}-expenses`}>
                <td className="text-left">
                  {title}
                </td>
                <td className="text-right">
                  <MoneyValue bold className="text-white" amount={sum / diff} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );

    return (
      <Card body className="px-3 py-2">
        <h4
          className="mb-1"
          style={{
            color: HEX_COLORS[color],
          }}
        >
          <i aria-hidden className={icon} />
          {' '}
          {name}
        </h4>
        <Container fluid className="p-0">
          <Row>
            <Col sm={6}>
              <p className="mb-0">
                <span>Selected Period</span>
                <small className="d-block">
                  {after.format(MOMENT_VIEW_DATE_FORMAT_SHORT)}
                  {' - '}
                  {before.format(MOMENT_VIEW_DATE_FORMAT_SHORT)}
                </small>
              </p>
              {dataTable(total)}
            </Col>
            <Col sm={6}>
              <p className="mb-0">
                Previous Period:
                <small className="d-block">
                  {previousPeriod.from.format(MOMENT_VIEW_DATE_FORMAT_SHORT)}
                  {' - '}
                  {previousPeriod.to.format(MOMENT_VIEW_DATE_FORMAT_SHORT)}
                </small>
              </p>
              {dataTable(previous)}
            </Col>
          </Row>
        </Container>
      </Card>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" />
          </filter>
        </defs>
        <Pie
          clockwise
          labelLine={false}
          outerRadius="100%"
          innerRadius="70%"
          dataKey="total"
          startAngle={90}
          endAngle={450}
          data={chartData}
          onDoubleClick={({ name }) => onClick(name)}
          onMouseEnter={onSectorEnter}
          onMouseLeave={() => setActive()}
        >
          {chartData.map(({ name, total, previous }, index) => {
            const color = expenseRatioColor(amountInPercentage(previous, total, 0));

            return (
              <Cell
                filter="url(#shadow)"
                key={`account-${name}`}
                stroke={HEX_COLORS[color]}
                strokeWidth={active === index ? 3 : 2}
                fill={`${HEX_COLORS[color]}${active === index ? '33' : '11'}`}
              />
            );
          })}
        </Pie>

        <Pie
          labelLine={false}
          outerRadius="67%"
          innerRadius="40%"
          startAngle={90}
          endAngle={450}
          dataKey="previous"
          data={chartData}
          onDoubleClick={({ name }) => onClick(name)}
          onMouseEnter={onSectorEnter}
          onMouseLeave={() => setActive()}
        >
          {chartData
            .map(({ name, total, previous }, index) => {
              const color = expenseRatioColor(amountInPercentage(previous, total, 0));

              return (
                <Cell
                  key={`account-${name}`}
                  stroke={`${HEX_COLORS[color]}33`}
                  strokeWidth={active === index ? 4 : 2}
                  fill={`${HEX_COLORS[color]}${active === index ? '33' : '11'}`}
                />
              );
            })}
        </Pie>
        <Tooltip content={tooltipFormatter} />
      </PieChart>
    </ResponsiveContainer>
  );
};

TransactionCategories.defaultProps = {
  selectedCategory: undefined,
};

TransactionCategories.propTypes = {
  after: PropTypes.object.isRequired,
  before: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
};

export default TransactionCategories;
