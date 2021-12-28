import axios from 'src/services/http';
import moment from 'moment-timezone';
import xor from 'lodash/xor';
import React, { useEffect, useState } from 'react';
import { Card, Button } from 'reactstrap';
import { Bar, BarChart, Brush, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATE_FORMAT, MOMENT_VIEW_DATE_WITH_YEAR_FORMAT } from 'src/constants/datetime';
import Routing from 'src/services/routing';
import { EXPENSE_TYPE, INCOME_TYPE, TRANSACTION_TYPES } from 'src/constants/transactions';

const INTERVALS = {
  '1d': [moment(), moment()],
  '1w': [moment().subtract(1, 'week'), moment()],
  '1m': [moment().subtract(1, 'month'), moment()],
  '3m': [moment().subtract(3, 'months'), moment()],
  '6m': [moment().subtract(6, 'months'), moment()],
  '1y': [moment().subtract(1, 'year'), moment()],
  '2y': [moment().subtract(2, 'years'), moment()],
  '5y': [moment().subtract(5, 'years'), moment()],
  '10y': [moment().subtract(10, 'years'), moment()],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active) {
    return null;
  }

  const date = moment.unix(label);

  return (
    <Card body className="px-3 py-2">
      <h5 className="mb-1">{date.format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}</h5>
      <p className="text-success mb-0">
        <MoneyValue bold amount={payload?.[1]?.value} maximumFractionDigits={0} />
      </p>
      <p className="text-danger mb-0">
        <MoneyValue bold amount={Math.abs(payload?.[0]?.value)} maximumFractionDigits={0} />
      </p>
    </Card>
  );
};

/**
 * TODO: Format ticks & tooltips by interval
 */
const MoneyFlowChart = () => {
  const [interval, setInterval] = useState('1y');
  const [displayValues, setDisplayValues] = useState(TRANSACTION_TYPES);
  const [data, setData] = useState([]);

  const toggleDisplayType = (type) => setDisplayValues(xor(displayValues, [type]));

  useEffect(() => {
    axios
      .get(
        Routing.generate('api_v1_statistics_income_expense', {
          from: INTERVALS[interval][0].format(MOMENT_DATE_FORMAT),
          to: INTERVALS[interval][1].format(MOMENT_DATE_FORMAT),
        }),
      )
      .then(({ data }) => setData(data));
  }, [interval]);

  const xTickFormatter = (val, index) => {
    const date = moment.unix(val);

    return index % 7 ? '' : date.format('MMMM');
  };

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
            />
            <Bar
              stackId="1"
              hide={!displayValues.includes(INCOME_TYPE)}
              dataKey="income"
              type="monotone"
              stroke="#00f27d"
              dot={false}
              fill="url(#income-gradient)"
            />

            <Brush dataKey="date" height={30} stroke="#8884d8" />

            <XAxis dataKey="date" axisLine={false} tickLine={false} tickFormatter={xTickFormatter} />

            <CartesianGrid opacity={0.1} vertical={false} />
            <Legend onClick={({ value }) => toggleDisplayType(value)} />
            <Tooltip cursor={false} content={<CustomTooltip />} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

MoneyFlowChart.propTypes = {};

export default MoneyFlowChart;
