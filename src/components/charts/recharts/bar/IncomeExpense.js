import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
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
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import { isActionLoading } from 'src/utils/common';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';
import { fetchStatistics } from 'src/store/actions/dashboard';

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
    xTickFormat: 'Do MMM',
  },
  '1m': {
    value: [moment().subtract(1, 'month'), moment()],
    tooltipDateFormat: 'ddd Do MMM',
    xTickFormat: 'Do MMM',
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

const NAME = 'incomeExpense';
const CONFIG = {
  name: 'incomeExpense',
  path: 'api/transactions/statistics/income-expense',
};

/**
 * TODO: Format ticks & tooltips by interval
 */
const IncomeExpenseChart = ({ isLoading, onUpdate, fetchStatistics }) => {
  const [model, setModel] = useState(new TimeperiodStatistics({
    data: [],
    from: moment().subtract(6, 'month'),
    to: moment(),
  }));
  const [interval, setInterval] = useState('6m');
  const [displayValues, setDisplayValues] = useState(INCOME_TYPE);
  const { data } = model;

  const toggleDisplayType = (type) => setDisplayValues([type]);

  const fetchData = async () => {
    const data = await fetchStatistics(CONFIG);
    setModel(model.set('data', data));
  };

  useEffect(() => {
    onUpdate(model.merge({
      from: INTERVALS[interval].value[0],
      to: INTERVALS[interval].value[1],
    }));
  }, [interval]);

  useEffect(() => {
    fetchData();
  }, []);

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

IncomeExpenseChart.defaultProps = {
  isLoading: false,
};

IncomeExpenseChart.propTypes = {
  isLoading: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  fetchStatistics: PropTypes.func.isRequired,
};

const mapStateToProps = ({ ui }) => ({
  isLoading: isActionLoading(ui[`DASHBOARD_FETCH_STATISTICS_${upperCase(snakeCase(NAME))}`]),
});

export default connect(mapStateToProps, { fetchStatistics })(IncomeExpenseChart);
