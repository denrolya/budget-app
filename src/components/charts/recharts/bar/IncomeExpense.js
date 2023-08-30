import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import cn from 'classnames';
import React, { useState } from 'react';
import { Card } from 'reactstrap';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import MoneyValue from 'src/components/MoneyValue';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import { INTERVALS } from 'src/constants/statistics';

/**
 * TODO: Format ticks & tooltips by interval
 */
const IncomeExpenseChart = ({ data, interval }) => {
  const [displayValues, setDisplayValues] = useState(INCOME_TYPE);

  const toggleDisplayType = (type) => setDisplayValues([type]);

  const xTickFormatter = (val, index) => {
    const date = moment.unix(val);

    return index % 7 ? '' : date.format(INTERVALS[interval].xTickFormat);
  };

  const tooltipFormatter = ({ active, payload }) => (active && payload?.length) && (
    <Card body className="px-3 py-2">
      <h4 className="mb-1 text-white">
        <i aria-hidden className="ion-ios-calendar" />
        {' '}
        {moment.unix(payload[0].payload.after).format(INTERVALS[interval].tooltipDateFormat)}
        {' - '}
        {moment.unix(payload[0].payload.before).format(INTERVALS[interval].tooltipDateFormat)}
      </h4>

      {displayValues.includes(INCOME_TYPE) && (
        <p className={cn('mb-0', 'text-success')}>
          <MoneyValue bold maximumFractionDigits={0} amount={Math.abs(payload?.[0]?.payload.income)} />
        </p>
      )}

      {displayValues.includes(EXPENSE_TYPE) && (
        <p className={cn('mb-0', 'text-danger')}>
          <MoneyValue bold maximumFractionDigits={0} amount={Math.abs(payload?.[0]?.payload.expense)} />
        </p>
      )}
    </Card>
  );

  return (
    <div>
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart stackOffset="sign" data={data}>
            <defs>
              <linearGradient id="income-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f27d" stopOpacity={0.4} />
                <stop offset="90%" stopColor="#00f27d11" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="expense-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fd4b4b11" stopOpacity={0.2} />
                <stop offset="45%" stopColor="#fd4b4b" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <Bar
              stackId="1"
              hide={!displayValues.includes(EXPENSE_TYPE)}
              dataKey="expense"
              type="monotone"
              stroke="#fd4b4b"
              dot={false}
              fill="url(#expense-gradient)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              stackId="1"
              hide={!displayValues.includes(INCOME_TYPE)}
              dataKey="income"
              type="monotone"
              stroke="#00f27d"
              dot={false}
              fill="url(#income-gradient)"
              radius={[8, 8, 0, 0]}
            />

            <XAxis dataKey="after" axisLine={false} tickLine={false} tickFormatter={xTickFormatter} />

            <CartesianGrid opacity={0.1} vertical={false} />
            <Legend onClick={({ value }) => toggleDisplayType(value)} />
            <Tooltip cursor={false} content={tooltipFormatter} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

IncomeExpenseChart.defaultProps = {};

IncomeExpenseChart.propTypes = {
  data: PropTypes.array.isRequired,
  interval: PropTypes.string.isRequired,
};

export default IncomeExpenseChart;
