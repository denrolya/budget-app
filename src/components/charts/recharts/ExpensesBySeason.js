import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { HEX_COLORS } from 'src/constants/charts';

const renderActiveShape = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  symbol,
  value,
}) => (
  <g>
    <text x={cx} y={cy} dy={-5} dx={-5} fontSize="30" textAnchor="middle" fill={HEX_COLORS.text}>
      {symbol} {value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
    </text>
    <text x={cx} y={cy} dy={20} fontSize="16" textAnchor="middle" fill={HEX_COLORS.default}>
      {payload.name}
    </text>
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
    <Sector
      cx={cx}
      cy={cy}
      startAngle={startAngle}
      endAngle={endAngle}
      innerRadius={outerRadius + 6}
      outerRadius={outerRadius + 10}
      fill={fill}
    />
  </g>
);

const ExpensesBySeason = ({ data }) => {
  const [chartData, setChartData] = useState([
    {
      value: 0,
      name: 'Winter',
      fill: '#1d8cf8',
    },
    {
      value: 0,
      name: 'Spring',
      fill: '#00f27d',
    },
    {
      value: 0,
      name: 'Summer',
      fill: '#fd4b4b',
    },
    {
      value: 0,
      name: 'Autumn',
      fill: '#ff8d72',
    },
  ]);
  const { symbol } = useBaseCurrency();
  const [active, setActive] = useState(0);
  const onSectorEnter = (_, index) => setActive(index);

  useEffect(() => {
    setChartData(
      data.map((value, k) => ({
        ...chartData[k],
        value,
      })),
    );
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          clockwise
          startAngle={270}
          endAngle={-270}
          stroke="none"
          cx="50%"
          cy="50%"
          paddingAngle={5}
          innerRadius={85}
          outerRadius={100}
          dataKey="value"
          activeIndex={active}
          activeShape={(renderProps) => renderActiveShape({ ...renderProps, symbol })}
          data={chartData}
          symbol={symbol}
          onMouseEnter={onSectorEnter}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

ExpensesBySeason.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ExpensesBySeason;
