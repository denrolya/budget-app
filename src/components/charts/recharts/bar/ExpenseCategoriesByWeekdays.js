import max from 'lodash/max';
import React from 'react';
import PropTypes from 'prop-types';
import color from 'randomcolor';
import moment from 'moment-timezone';
import { Card } from 'reactstrap';
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, Tooltip, YAxis,
} from 'recharts';

import MoneyValue from 'src/components/MoneyValue';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const ExpenseCategoriesByWeekdays = ({ topCategories, data }) => {
  const { symbol } = useBaseCurrency();

  const yAxisTickFormatter = (val) => `${symbol} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const tooltipFormatter = ({ active, payload, label }) => (active && payload?.length) && (
    <Card body className="px-3 py-2">
      <h4 className="mb-1">
        <i aria-hidden className="ion-ios-calendar" />
        { ' '}
        {moment().isoWeekday(label + 1).format('dddd')}
      </h4>
      {Object.keys(payload[0].payload.values).map((category) => (
        <p
          className="mb-0"
          style={{
            color: color({
              luminosity: 'bright',
              seed: category,
            }),
          }}
        >
          {`${category}: `}
          <MoneyValue bold amount={payload[0].payload.values[category]} />
        </p>
      ))}
    </Card>
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data.map((el) => {
          if (topCategories) {
            const maxValue = max(Object.values(el.values));
            const maxName = Object.keys(el.values).find((cat) => el.values[cat] === maxValue);

            return {
              ...el,
              values: {
                [maxName]: maxValue,
              },
            };
          }

          return el;
        })}
      >
        <CartesianGrid opacity={0.1} vertical={false} />
        {Object.keys(data[0].values).map((categoryName) => (
          <Bar
            stackId="a"
            dataKey={`values.${categoryName}`}
            fill={color({
              luminosity: 'bright',
              seed: categoryName,
            })}
          />
        ))}
        <YAxis
          tickCount={3}
          width={45}
          tick={{ fontSize: 9 }}
          axisLine={false}
          tickFormatter={yAxisTickFormatter}
        />
        <Tooltip cursor={false} content={tooltipFormatter} />
      </BarChart>
    </ResponsiveContainer>
  );
};

ExpenseCategoriesByWeekdays.propTypes = {
  topCategories: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
  })).isRequired,
};

export default ExpenseCategoriesByWeekdays;
