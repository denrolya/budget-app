import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Card } from 'reactstrap';

import { HEX_COLORS } from 'src/constants/charts';

const CustomTooltip = ({ active, payload }) => {
  if (!active) {
    return null;
  }

  return (
    <Card body className="px-3 py-2">
      <p className="mb-0">
        {payload[0].value} transactions in {payload[0].payload.date.format('MMMM')}
      </p>
    </Card>
  );
};

const TransactionsCountByMonth = ({ height, width, data }) => (
  <ResponsiveContainer width={width} height={height}>
    <BarChart data={data} barGap="90%" barCategoryGap="70%">
      <CartesianGrid vertical={false} stroke={HEX_COLORS.default} />

      <YAxis
        dataKey="value"
        tickCount={3}
        stroke={HEX_COLORS.text}
        tick={{ fontSize: 10 }}
        width={20}
        axisLine={false}
        tickLine={false}
      />
      <XAxis hide dataKey="date" axisLine={false} tickLine={false} />

      <Tooltip cursor={false} content={<CustomTooltip />} />
      <Bar dataKey="value" width={5} fill={HEX_COLORS.secondary} />
    </BarChart>
  </ResponsiveContainer>
);

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
