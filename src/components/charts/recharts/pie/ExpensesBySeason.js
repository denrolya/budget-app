import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart, Pie, Sector, ResponsiveContainer,
} from 'recharts';

import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { HEX_COLORS } from 'src/constants/color';

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
      {symbol}
      {' '}
      {value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
    const result = [0, 0, 0, 0];
    data.forEach(({ date, expense }) => {
      const month = moment.unix(date).month();
      switch (month) {
        case 1:
        case 2:
        case 12:
          result[0] += expense;
          break;
        case 3:
        case 4:
        case 5:
          result[1] += expense;
          break;
        case 6:
        case 7:
        case 8:
          result[2] += expense;
          break;
        case 9:
        case 10:
        case 11:
          result[3] += expense;
          break;
          // no default
      }
    });

    setChartData(
      result.map((value, k) => ({
        ...chartData[k],
        value,
      })),
    );
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" />
          </filter>
        </defs>
        <Pie
          clockwise
          filter="url(#shadow)"
          startAngle={270}
          endAngle={-270}
          stroke="none"
          cx="50%"
          cy="50%"
          paddingAngle={5}
          innerRadius="85%"
          outerRadius="90%"
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
