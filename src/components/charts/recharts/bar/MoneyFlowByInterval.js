import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Container,
  Row,
  Col,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_VIEW_DATE_FORMAT_SHORT, MOMENT_VIEW_DATE_WITH_YEAR_FORMAT } from 'src/constants/datetime';
import { EXPENSE_TYPE, INCOME_TYPE, TRANSACTION_TYPES } from 'src/constants/transactions';
import { HEX_COLORS } from 'src/constants/color';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

/* eslint-disable no-unused-vars */
const MoneyFlowByInterval = ({
  after, before, interval, previousPeriod, data, height, visibleTypes,
}) => {
  const { symbol } = useBaseCurrency();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData(data.selectedPeriod.map((entry, index) => ({
      date: entry.after,
      selectedPeriod: {
        after: moment.unix(entry.after),
        before: moment.unix(entry.before),
      },
      previousPeriod: previousPeriod ? {
        after: moment.unix(data.previousPeriod[index].after),
        before: moment.unix(data.previousPeriod[index].before),
      } : undefined,
      expensePrevious: previousPeriod ? -data.previousPeriod[index].expense : undefined,
      incomePrevious: previousPeriod ? data.previousPeriod[index].income : undefined,
      expenseCurrent: -entry.expense,
      incomeCurrent: entry.income,
    })));
  }, [data]);

  const yAxisTickFormatter = (val) => val.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const xTickFormatter = (val) => moment.unix(val).format('MMM');

  const tooltipFormatter = ({ active, payload }) => {
    if (!active) {
      return null;
    }

    const expenseCurrent = payload.find(({ name }) => name === 'expenseCurrent');
    const incomeCurrent = payload.find(({ name }) => name === 'incomeCurrent');
    const expensePrevious = previousPeriod ? payload.find(({ name }) => name === 'expensePrevious') : undefined;
    const incomePrevious = previousPeriod ? payload.find(({ name }) => name === 'incomePrevious') : undefined;

    let selectedPeriodString = '';
    let previousPeriodString = '';

    switch (interval) {
      case '1 week':
        selectedPeriodString = `Week #${payload[0].payload.selectedPeriod.after.isoWeek()}: ${payload[0].payload.selectedPeriod.after.format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)} - ${payload[0].payload.selectedPeriod.before.format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}`;
        previousPeriodString = previousPeriod
          ? `Week #${payload[0].payload.previousPeriod.after.isoWeek()}: ${payload[0].payload.previousPeriod.after.format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)} - ${payload[0].payload.previousPeriod.before.format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}`
          : undefined;
        break;
      case '1 month':
        selectedPeriodString = payload[0].payload.selectedPeriod.after.format('MMMM YYYY');
        previousPeriodString = previousPeriod
          ? payload[0].payload.previousPeriod.after.format('MMMM YYYY')
          : undefined;
        break;
      case '1 day':
      default:
        selectedPeriodString = `${payload[0].payload.selectedPeriod.after.format(MOMENT_VIEW_DATE_FORMAT_SHORT)} - ${payload[0].payload.selectedPeriod.before.format(MOMENT_VIEW_DATE_FORMAT_SHORT)}`;
        previousPeriodString = previousPeriod
          ? `${payload[0].payload.previousPeriod.after.format(MOMENT_VIEW_DATE_FORMAT_SHORT)} - ${payload[0].payload.previousPeriod.before.format(MOMENT_VIEW_DATE_FORMAT_SHORT)}`
          : undefined;
        break;
    }

    return (
      <Card body className="px-3 py-2">
        <Container fluid className="p-0">
          <Row>
            <Col sm={6}>
              <h4 className="mb-0">
                <span>Selected Period:</span>
                <small className="d-block text-nowrap">
                  { selectedPeriodString }
                </small>
              </h4>
              <hr className="my-1" />
              <p className="mb-0 text-nowrap">
                { 'Income: ' }
                <MoneyValue
                  bold
                  className="text-success"
                  maximumFractionDigits={0}
                  amount={incomeCurrent.value}
                />
              </p>
              <p className="mb-0 text-nowrap">
                { 'Expense: ' }
                <MoneyValue
                  bold
                  className="text-danger"
                  maximumFractionDigits={0}
                  amount={Math.abs(expenseCurrent.value)}
                />
              </p>
            </Col>
            { previousPeriod && (
              <Col sm={6}>
                <h4 className="mb-0">
                  Previous Period:
                  <small className="d-block text-nowrap">
                    { previousPeriodString }
                  </small>
                </h4>
                <hr className="my-1" />
                <p className="mb-0 text-nowrap">
                  { 'Income: ' }
                  <MoneyValue
                    bold
                    className="text-success"
                    maximumFractionDigits={0}
                    amount={incomePrevious.value}
                  />
                </p>
                <p className="mb-0 text-nowrap">
                  { 'Expense: ' }
                  <MoneyValue
                    bold
                    className="text-danger"
                    maximumFractionDigits={0}
                    amount={Math.abs(expensePrevious.value)}
                  />
                </p>
              </Col>
            )}
          </Row>
        </Container>
      </Card>
    );
  };

  return chartData.length > 0 && (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart stackOffset="sign" padding={0} margin={0} data={chartData}>
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
          xAxisId={0}
          hide={!visibleTypes.includes(EXPENSE_TYPE)}
          dataKey="expenseCurrent"
          stroke={HEX_COLORS.danger}
          strokeWidth={2}
          dot={false}
          barSize={75}
          fill={`${HEX_COLORS.danger}33`}
          radius={[8, 8, 0, 0]}
        />
        <Bar
          stackId="1"
          xAxisId={0}
          hide={!visibleTypes.includes(INCOME_TYPE)}
          dataKey="incomeCurrent"
          stroke={HEX_COLORS.success}
          strokeWidth={2}
          dot={false}
          barSize={75}
          fill={`${HEX_COLORS.success}33`}
          radius={[8, 8, 0, 0]}
        />

        { previousPeriod && (
          <>
            <Bar
              stackId="2"
              xAxisId={1}
              hide={!visibleTypes.includes(EXPENSE_TYPE)}
              dataKey="expensePrevious"
              stroke={HEX_COLORS.danger}
              opacity={0.1}
              strokeWidth={2}
              dot={false}
              barSize={75}
              fill={`${HEX_COLORS.danger}33`}
              radius={[8, 8, 0, 0]}
            />
            <Bar
              stackId="2"
              xAxisId={1}
              hide={!visibleTypes.includes(INCOME_TYPE)}
              dataKey="incomePrevious"
              stroke={HEX_COLORS.success}
              opacity={0.1}
              strokeWidth={2}
              dot={false}
              barSize={75}
              fill={`${HEX_COLORS.success}33`}
              radius={[8, 8, 0, 0]}
            />
          </>
        )}

        <YAxis
          unit={symbol}
          orientation="left"
          tickCount={7}
          tick={{ fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          stroke={HEX_COLORS.text}
          tickFormatter={yAxisTickFormatter}
        />
        <XAxis
          xAxisId={0}
          dataKey="date"
          tick={{ fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          stroke={HEX_COLORS.text}
          tickFormatter={xTickFormatter}
        />
        {previousPeriod && (
          <XAxis
            hide
            xAxisId={1}
            dataKey="date"
            fillOpacity={0.6}
          />
        )}

        <CartesianGrid opacity={0.1} vertical={false} stroke={HEX_COLORS.text} />
        <Tooltip cursor={false} content={tooltipFormatter} />
      </BarChart>
    </ResponsiveContainer>
  );
};

MoneyFlowByInterval.defaultProps = {
  data: {
    selectedPeriod: [],
    previousPeriod: undefined,
  },
  height: 250,
  previousPeriod: false,
};

MoneyFlowByInterval.propTypes = {
  after: PropTypes.object.isRequired,
  before: PropTypes.object.isRequired,
  interval: PropTypes.string.isRequired,
  visibleTypes: PropTypes.arrayOf(PropTypes.oneOf(TRANSACTION_TYPES)).isRequired,
  previousPeriod: PropTypes.bool,
  data: PropTypes.shape({
    selectedPeriod: PropTypes.arrayOf(
      PropTypes.shape({
        after: PropTypes.number.isRequired,
        before: PropTypes.number.isRequired,
        expense: PropTypes.number.isRequired,
        income: PropTypes.number.isRequired,
      }),
    ).isRequired,
    previousPeriod: PropTypes.arrayOf(
      PropTypes.shape({
        after: PropTypes.number.isRequired,
        before: PropTypes.number.isRequired,
        expense: PropTypes.number.isRequired,
        income: PropTypes.number.isRequired,
      }),
    ),
  }),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default MoneyFlowByInterval;
