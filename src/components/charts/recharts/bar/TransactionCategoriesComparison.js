import React from 'react';
import { Card } from 'reactstrap';
import PropTypes from 'prop-types';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/color';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const CustomTooltip = ({ active, payload, selectedYear }) => {
  if (!active) {
    return null;
  }

  return (
    <Card body className="px-3 py-2">
      <h4 className="mb-1 text-white">
        <i aria-hidden className={payload[0].payload.icon} />
        {' '}
        {payload[0].payload.name}
      </h4>
      <p className="text-default mb-0">
        {selectedYear - 1}
        :
        <MoneyValue bold amount={payload?.[0]?.value} maximumFractionDigits={0} />
      </p>
      <p className="text-info mb-0">
        {selectedYear}
        :
        <MoneyValue bold amount={Math.abs(payload?.[1]?.value)} maximumFractionDigits={0} />
      </p>
    </Card>
  );
};

CustomTooltip.defaultProps = {
  active: false,
};

CustomTooltip.propTypes = {
  payload: PropTypes.array.isRequired,
  selectedYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  active: PropTypes.bool,
};

const TransactionCategoriesComparison = ({ data, selectedYear }) => {
  const { symbol } = useBaseCurrency();
  const yAxisTickFormatter = (val) => `${symbol} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap="5%" barCategoryGap="15%">
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" />
          </filter>
          <linearGradient id="previous-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`${HEX_COLORS.default}`} stopOpacity={0.2} />
            <stop offset="50%" stopColor={`${HEX_COLORS.default}11`} stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id="current-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={HEX_COLORS.info} stopOpacity={0.4} />
            <stop offset="50%" stopColor={`${HEX_COLORS.info}11`} stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <Bar filter="url(#shadow)" dataKey="previous" fill="url(#previous-gradient)" dot={false} stroke={HEX_COLORS.default} />
        <Bar filter="url(#shadow)" dataKey="current" fill="url(#current-gradient)" dot={false} stroke={HEX_COLORS.info} />

        <YAxis
          dataKey="current"
          width={45}
          tick={{ fontSize: 9 }}
          tickCount={3}
          axisLine={false}
          tickFormatter={yAxisTickFormatter}
        />
        <XAxis dataKey="name" axisLine={false} />

        <CartesianGrid opacity={0.1} vertical={false} />
        <Tooltip cursor={false} content={<CustomTooltip selectedYear={selectedYear} />} />
      </BarChart>
    </ResponsiveContainer>
  );
};

TransactionCategoriesComparison.defaultProps = {
  data: [],
};

TransactionCategoriesComparison.propTypes = {
  selectedYear: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      current: PropTypes.number.isRequired,
      previous: PropTypes.number.isRequired,
    }),
  ),
};

export default TransactionCategoriesComparison;
