import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from 'recharts';
import { Card } from 'reactstrap';

import { HEX_COLORS } from 'src/constants/color';

const TransactionsCountByMonth = ({ height, width, data }) => {
  const tooltipFormatter = ({ active, payload }) => (active && payload?.length) && (
    <Card body className="px-3 py-2">
      <p className="mb-0">
        {payload[0].value}
        {' '}
        transactions in
        {' '}
        {payload[0].payload.date.format('MMMM')}
      </p>
    </Card>
  );

  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data} barGap="90%" barCategoryGap="70%">
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" />
          </filter>
        </defs>
        <CartesianGrid vertical={false} stroke={HEX_COLORS.default} />

        <YAxis
          dataKey="value"
          tickCount={3}
          stroke={HEX_COLORS.text}
          tick={{ fontSize: 9 }}
          width={20}
          axisLine={false}
          tickLine={false}
        />
        <XAxis hide dataKey="date" axisLine={false} tickLine={false} />

        <Tooltip cursor={false} content={tooltipFormatter} />
        <Bar filter="url(#shadow)" dataKey="value" width={5} fill={HEX_COLORS.secondary} />
      </BarChart>
    </ResponsiveContainer>
  );
};

TransactionsCountByMonth.defaultProps = {
  height: 400,
  width: '100%',
};

TransactionsCountByMonth.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.object.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default TransactionsCountByMonth;
