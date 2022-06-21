import React from 'react';
import { Card } from 'reactstrap';
import PropTypes from 'prop-types';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/color';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const TransactionCategoriesComparison = ({ data, selectedYear }) => {
  const { symbol } = useBaseCurrency();

  const yAxisTickFormatter = (val) => `${symbol} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const tooltipFormatter = ({ active, payload }) => (active && payload?.length) && (
    <Card body className="px-3 py-2">
      <h4 className="mb-1 text-white">
        <i aria-hidden className={payload[0].payload.icon} />
        {' '}
        {payload[0].payload.name}
      </h4>
      <p className="mb-0">
        <i aria-hidden className="ion-ios-calendar" />
        {' '}
        {selectedYear - 1}
        {': '}
        <MoneyValue bold className="text-default" amount={payload?.[0]?.value} maximumFractionDigits={0} />
      </p>
      <p className="mb-0">
        <i aria-hidden className="ion-ios-calendar" />
        {' '}
        {selectedYear}
        {': '}
        <MoneyValue bold className="text-info" amount={Math.abs(payload?.[1]?.value)} maximumFractionDigits={0} />
      </p>
    </Card>
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap="5%" barCategoryGap="15%">
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" />
          </filter>
        </defs>

        <Bar
          filter="url(#shadow)"
          dataKey="previous"
          fill={`${HEX_COLORS.default}33`}
          dot={false}
          stroke={HEX_COLORS.default}
          strokeWidth={2}
          radius={[8, 8, 8, 8]}
        />
        <Bar
          filter="url(#shadow)"
          dataKey="total"
          fill={`${HEX_COLORS.info}33`}
          dot={false}
          stroke={HEX_COLORS.info}
          strokeWidth={2}
          radius={[8, 8, 8, 8]}
        />

        <YAxis
          dataKey="previous"
          width={45}
          tick={{ fontSize: 9 }}
          tickCount={8}
          axisLine={false}
          tickFormatter={yAxisTickFormatter}
        />
        <XAxis dataKey="name" axisLine={false} />

        <CartesianGrid opacity={0.1} vertical={false} />
        <Tooltip cursor={false} content={tooltipFormatter} />
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
