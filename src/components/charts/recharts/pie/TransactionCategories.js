import React, { useState, useEffect } from 'react';
import { Card } from 'reactstrap';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import PropTypes from 'prop-types';

import { amountInPercentage, expenseRatioColor } from 'src/utils/common';
import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/color';

const TransactionCategories = ({ data, selectedCategory, onClick }) => {
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
        <p className="mb-0">
          Selected Period:
          {' '}
          <MoneyValue bold className="text-white" amount={total} maximumFractionDigits={0} />
        </p>
        <p className="mb-0">
          Previous Period:
          {' '}
          <MoneyValue bold className="text-white" amount={previous} maximumFractionDigits={0} />
        </p>
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
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
};

export default TransactionCategories;
