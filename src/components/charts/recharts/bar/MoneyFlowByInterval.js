import moment from 'moment-timezone';
import xor from 'lodash/xor';
import React, { useState, useEffect } from 'react';
import { Card } from 'reactstrap';
import PropTypes from 'prop-types';
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis,
} from 'recharts';

import MoneyValue from 'src/components/MoneyValue';
import { EXPENSE_TYPE, INCOME_TYPE, TRANSACTION_TYPES } from 'src/constants/transactions';
import { HEX_COLORS } from 'src/constants/color';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active) {
    return null;
  }

  const expense = payload.find(({ name }) => name === EXPENSE_TYPE);
  const income = payload.find(({ name }) => name === INCOME_TYPE);

  const date = moment.unix(label);

  return (
    <Card body className="px-3 py-2">
      <h5 className="mb-1">
        <i aria-hidden className="ion-ios-calendar" />
        {' '}
        {date.format('MMMM')}
      </h5>
      {income && (
        <p className="text-info mb-0">
          <MoneyValue bold amount={income.value} maximumFractionDigits={0} />
        </p>
      )}
      {expense && (
        <p className="text-primary mb-0">
          <MoneyValue bold amount={Math.abs(expense.value)} maximumFractionDigits={0} />
        </p>
      )}
    </Card>
  );
};

CustomTooltip.defaultProps = {
  active: false,
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  payload: PropTypes.array,
};

/**
 * TODO: Format ticks & tooltips by interval
 */
/* eslint-disable no-unused-vars */
const MoneyFlowByInterval = ({ data, height, interval }) => {
  const [chartData, setChartData] = useState([]);
  const [displayValues, setDisplayValues] = useState(TRANSACTION_TYPES);
  const toggleDisplayType = (type) => setDisplayValues(xor(displayValues, [type]));

  const xTickFormatter = (val) => moment.unix(val).format('MMMM');

  useEffect(() => {
    setChartData(
      data.map(({ expense, ...rest }) => ({
        ...rest,
        expense: -expense,
      })),
    );
  }, [data]);

  return chartData.length > 0 && (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart stackOffset="sign" data={chartData}>
        <defs>
          <linearGradient id="income-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={HEX_COLORS.info} stopOpacity={0.4} />
            <stop offset="80%" stopColor={`${HEX_COLORS.info}11`} stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="expense-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`${HEX_COLORS.primary}11`} stopOpacity={0.2} />
            <stop offset="80%" stopColor={HEX_COLORS.primary} stopOpacity={0.4} />
          </linearGradient>
        </defs>

        <Bar
          stackId="1"
          hide={!displayValues.includes(EXPENSE_TYPE)}
          dataKey="expense"
          stroke={HEX_COLORS.primary}
          strokeWidth={2}
          dot={false}
          fill="url(#expense-gradient)"
        />
        <Bar
          stackId="1"
          hide={!displayValues.includes(INCOME_TYPE)}
          dataKey="income"
          stroke={HEX_COLORS.info}
          strokeWidth={2}
          dot={false}
          fill="url(#income-gradient)"
        />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          stroke={HEX_COLORS.text}
          tickFormatter={xTickFormatter}
        />

        <CartesianGrid opacity={0.1} vertical={false} stroke={HEX_COLORS.text} />
        <Legend onClick={({ value }) => toggleDisplayType(value)} />
        <Tooltip cursor={false} content={<CustomTooltip displayValues={displayValues} />} />
      </BarChart>
    </ResponsiveContainer>
  );
};

MoneyFlowByInterval.defaultProps = {
  data: [],
  height: 250,
};

MoneyFlowByInterval.propTypes = {
  interval: PropTypes.oneOf(['1 day', '1 week', '1 month']).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.number.isRequired,
      expense: PropTypes.number.isRequired,
      income: PropTypes.number.isRequired,
    }),
  ),
  height: PropTypes.number,
};

export default MoneyFlowByInterval;
