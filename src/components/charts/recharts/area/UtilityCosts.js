import React, { useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts';
import color from 'randomcolor';
import PropTypes from 'prop-types';
import snakeCase from 'voca/snake_case';

import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/color';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const SEASONS = ['Winter', 'Spring', 'Summer', 'Autumn'];

const UtilityCosts = ({ data, name, color }) => {
  const { symbol } = useBaseCurrency();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData(
      data.map((value, index) => ({
        name: SEASONS[index],
        value,
      })),
    );
  }, [data]);

  const yAxisTickFormatter = (val) => `${symbol} ${val}`;

  const tooltipFormatter = ({ active, payload }) => (active && payload?.length) && (
    <Card body className="px-3 py-2">
      <h4 className="mb-1 text-white">
        <i aria-hidden className="ion-ios-calendar" />
        {' '}
        {payload[0].payload.name}
      </h4>
      <p>
        <MoneyValue bold amount={payload[0].value} maximumFractionDigits={0} />
      </p>
    </Card>
  );

  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart padding={0} margin={0} data={chartData}>
        <defs>
          <linearGradient id={`${snakeCase(name)}-gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="75%" stopColor={color} stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <CartesianGrid opacity={0.1} vertical={false} stroke={HEX_COLORS.text} />

        <Area
          type="monotone"
          dataKey="value"
          fill={`url(#${snakeCase(name)}-gradient)`}
          dot={false}
          strokeWidth={2}
          stroke={color}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9 }}
          width={40}
          stroke={HEX_COLORS.text}
          tickFormatter={yAxisTickFormatter}
        />

        <Tooltip content={tooltipFormatter} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

UtilityCosts.defaultProps = {
  color: color({
    luminosity: 'bright',
    hue: 'blue',
  }),
  data: [],
};

UtilityCosts.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.string,
};

export default UtilityCosts;
