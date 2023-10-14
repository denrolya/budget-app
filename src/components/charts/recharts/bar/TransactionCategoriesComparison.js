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
  const yAxisTickFormatter = (val) => val.toLocaleString(undefined, { maximumFractionDigits: 0 });

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
        <MoneyValue
          bold
          className="text-danger"
          maximumFractionDigits={0}
          amount={payload?.[0]?.value}
        />
      </p>
      <p className="mb-0">
        <i aria-hidden className="ion-ios-calendar" />
        {' '}
        {selectedYear}
        {': '}
        <MoneyValue
          bold
          className="text-success"
          maximumFractionDigits={0}
          amount={Math.abs(payload?.[1]?.value)}
        />
      </p>
    </Card>
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap="5%" barCategoryGap="15%" margin={0} padding={0}>
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" />
          </filter>
        </defs>

        <Bar
          filter="url(#shadow)"
          dataKey="previous"
          fill={`${HEX_COLORS.danger}33`}
          dot={false}
          stroke={HEX_COLORS.danger}
          strokeWidth={2}
          radius={[8, 8, 8, 8]}
        />
        <Bar
          filter="url(#shadow)"
          dataKey="total"
          fill={`${HEX_COLORS.success}33`}
          dot={false}
          stroke={HEX_COLORS.success}
          strokeWidth={2}
          radius={[8, 8, 8, 8]}
        />

        <YAxis
          unit="€"
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
      total: PropTypes.number.isRequired,
      previous: PropTypes.number.isRequired,
    }),
  ),
};

export default TransactionCategoriesComparison;
