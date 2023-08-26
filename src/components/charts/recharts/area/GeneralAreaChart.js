import moment from 'moment-timezone';
import React from 'react';
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

import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/color';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const GeneralAreaChart = ({
  data, name, dateFormat,
}) => {
  const { symbol } = useBaseCurrency();

  const yAxisTickFormatter = (val) => `${symbol} ${val}`;

  // TODO: Format should be dependent on interval between dates
  const tooltipFormatter = ({ active, payload }) => (active && payload?.length) && (
    <Card body className="px-3 py-2">
      <h4 className="mb-1 text-white">
        <i aria-hidden className="ion-ios-calendar" />
        {' '}
        {moment.unix(payload[0].payload.after).format(dateFormat)}
        {' - '}
        {moment.unix(payload[0].payload.before).format(dateFormat)}
      </h4>
      <p>
        <MoneyValue bold amount={payload[0].value} maximumFractionDigits={0} />
      </p>
    </Card>
  );

  const expenseColor = color({
    luminosity: 'bright',
    hue: 'red',
  });

  const incomeColor = color({
    luminosity: 'bright',
    hue: 'green',
  });

  const zeroExpenses = data.every((entry) => entry.expense === 0);
  const zeroIncomes = data.every((entry) => entry.income === 0);

  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart padding={0} margin={0} data={data}>
        <defs>
          <linearGradient id={`${snakeCase(name)}-expense-gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={expenseColor} stopOpacity={0.4} />
            <stop offset="75%" stopColor={expenseColor} stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id={`${snakeCase(name)}-income-gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={incomeColor} stopOpacity={0.4} />
            <stop offset="75%" stopColor={incomeColor} stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <CartesianGrid opacity={0.1} vertical={false} stroke={HEX_COLORS.text} />

        {!zeroExpenses && (
          <Area
            type="monotone"
            dataKey="expense"
            fill={`url(#${snakeCase(name)}-expense-gradient)`}
            dot={false}
            strokeWidth={2}
            stroke={expenseColor}
          />
        )}

        {!zeroIncomes && (
          <Area
            type="monotone"
            dataKey="income"
            fill={`url(#${snakeCase(name)}-income-gradient)`}
            dot={false}
            strokeWidth={2}
            stroke={incomeColor}
          />
        )}

        <YAxis
          axisLine={false}
          tickLine={false}
          ticks={[25, 50, 100]}
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

GeneralAreaChart.defaultProps = {
  data: [],
  dateFormat: MOMENT_DATE_FORMAT,
};

GeneralAreaChart.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    after: PropTypes.number.isRequired,
    before: PropTypes.number.isRequired,
    expense: PropTypes.number.isRequired,
    income: PropTypes.number.isRequired,
  })),
  dateFormat: PropTypes.string,
};

export default GeneralAreaChart;
