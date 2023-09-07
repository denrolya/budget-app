import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
} from 'recharts';

import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
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
    <text
      dy={-5}
      dx={-5}
      fontSize="30"
      textAnchor="middle"
      fill={HEX_COLORS.white}
      fontFamily="'Roboto Condensed', sans-serif"
      x={cx}
      y={cy}
    >
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

const SumBySeason = ({ data, type }) => {
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
    data.forEach((el) => {
      const month = moment.unix(el.after).month();
      switch (month) {
        case 0:
        case 1:
        case 11:
          result[0] += el[type];
          break;
        case 2:
        case 3:
        case 4:
          result[1] += el[type];
          break;
        case 5:
        case 6:
        case 7:
          result[2] += el[type];
          break;
        case 8:
        case 9:
        case 10:
          result[3] += el[type];
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
          stroke="none"
          cx="50%"
          cy="50%"
          innerRadius="85%"
          outerRadius="90%"
          dataKey="value"
          activeIndex={active}
          startAngle={270}
          endAngle={-270}
          paddingAngle={5}
          activeShape={(renderProps) => renderActiveShape({ ...renderProps, symbol })}
          data={chartData}
          symbol={symbol}
          onMouseEnter={onSectorEnter}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

SumBySeason.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.oneOf([INCOME_TYPE, EXPENSE_TYPE]).isRequired,
};

export default SumBySeason;
