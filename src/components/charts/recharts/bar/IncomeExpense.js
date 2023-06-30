import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { Card, Button } from 'reactstrap';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import MoneyValue from 'src/components/MoneyValue';
import { EXPENSE_TYPE, INCOME_TYPE, TRANSACTION_TYPES } from 'src/constants/transactions';

// before/after
const INTERVALS = {
  '1d': {
    value: [moment().subtract(1, 'day'), moment()],
    tooltipDateFormat: 'DD MM YYYY hh:mm:ss',
    xTickFormat: 'ddd HH:00',
  },
  '1w': {
    value: [moment().subtract(1, 'week'), moment()],
    tooltipDateFormat: 'ddd Do MMM HH:00',
    xTickFormat: 'Do',
  },
  '1m': {
    value: [moment().subtract(1, 'month'), moment()],
    tooltipDateFormat: 'ddd Do MMM',
    xTickFormat: 'Do',
  },
  '3m': {
    value: [moment().subtract(3, 'months'), moment()],
    tooltipDateFormat: 'ddd Do MMM',
    xTickFormat: 'Do MMM',
  },
  '6m': {
    value: [moment().subtract(6, 'months'), moment()],
    tooltipDateFormat: 'ddd Do MMM',
    xTickFormat: 'Do MMM',
  },
  '1y': {
    value: [moment().subtract(1, 'year'), moment()],
    tooltipDateFormat: 'D.MM.YY',
    xTickFormat: 'Do MMM',
  },
  '2y': {
    value: [moment().subtract(2, 'years'), moment()],
    tooltipDateFormat: 'ddd Do MMM YY',
    xTickFormat: 'Do MMM',
  },
  '5y': {
    value: [moment().subtract(5, 'years'), moment()],
    tooltipDateFormat: 'ddd Do MMM YYYY',
    xTickFormat: 'Do MMM YY',
  },
  '10y': {
    value: [moment().subtract(10, 'years'), moment()],
    tooltipDateFormat: 'ddd Do MMM YYYY',
    xTickFormat: 'Do MMM YY',
  },
};

/**
 * TODO: Format ticks & tooltips by interval
 */
const IncomeExpenseChart = ({ model, onUpdate }) => {
  const { data } = model;
  const [interval, setInterval] = useState('1m');
  const [displayValues, setDisplayValues] = useState(TRANSACTION_TYPES[0]);

  const toggleDisplayType = (type) => setDisplayValues([type]);

  useEffect(() => {
    onUpdate(model.merge({
      from: INTERVALS[interval].value[0],
      to: INTERVALS[interval].value[1],
    }));
  }, [interval]);

  const xTickFormatter = (val, index) => {
    const date = moment.unix(val);

    return index % 7 ? '' : date.format(INTERVALS[interval].xTickFormat);
  };

  const tooltipFormatter = ({ active, payload, label }) => (active && payload?.length) && (
    <Card body className="px-3 py-2">
      <h4 className="mb-1 text-white">
        <i aria-hidden className="ion-ios-calendar" />
        {' '}
        {moment.unix(payload[0].payload.from).format(INTERVALS[interval].tooltipDateFormat)}
        {' - '}
        {moment.unix(payload[0].payload.to).format(INTERVALS[interval].tooltipDateFormat)}
      </h4>
      <p
        className={cn('mb-0', {
          'text-success': displayValues.includes(INCOME_TYPE),
          'text-danger': displayValues.includes(EXPENSE_TYPE),
        })}
      >
        <MoneyValue bold maximumFractionDigits={0} amount={Math.abs(payload?.[0]?.value)} />
      </p>
    </Card>
  );

  return (
    <div>
      {Object.keys(INTERVALS).map((name) => (
        <Button
          size="sm"
          color="danger"
          className="text-uppercase btn-simple"
          key={name}
          active={name === interval}
          onClick={() => setInterval(name)}
        >
          {name}
        </Button>
      ))}
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

            <XAxis dataKey="date" axisLine={false} tickLine={false} tickFormatter={xTickFormatter} />

            <CartesianGrid opacity={0.1} vertical={false} />
            <Legend onClick={({ value }) => toggleDisplayType(value)} />
            <Tooltip cursor={false} content={tooltipFormatter} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

IncomeExpenseChart.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default IncomeExpenseChart;
