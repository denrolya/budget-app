import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer, LineChart, Line, Tooltip, YAxis, XAxis, CartesianGrid, Legend,
} from 'recharts';
import color from 'randomcolor';
import { Card } from 'reactstrap';

import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/charts';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const CustomTooltip = ({ active, payload }) => {
  if (!active) {
    return null;
  }

  const { date, values } = payload[0].payload;
  const categories = Object.keys(values);

  return (
    <Card body>
      <h4 className="mb-1 text-white">{moment.unix(date).format('MMMM')}</h4>
      {categories.map((category) => (
        <p className="mb-0" key={category}>
          {category}
          :
          {' '}
          <span
            style={{
              color: color({
                luminosity: 'bright',
                hue: 'aqua',
                seed: category,
              }),
            }}
          >
            <MoneyValue bold amount={values[category]} maximumFractionDigits={0} />
          </span>
        </p>
      ))}
    </Card>
  );
};

CustomTooltip.defaultProps = {
  active: false,
};

CustomTooltip.propTypes = {
  payload: PropTypes.array.isRequired,
  active: PropTypes.bool,
};

const TransactionCategoriesTimeline = ({ data }) => {
  const { symbol } = useBaseCurrency();
  const [chartData, setChartData] = useState();

  useEffect(() => {
    const categories = Object.keys(data);
    const dates = data[categories[0]].map(({ date }) => date);

    const test = dates.map((date, index) => {
      const result = {
        date,
        values: {},
      };

      categories.forEach((category) => {
        result.values[category] = data[category][index].value;
      });

      return result;
    });

    setChartData(test);
  }, [data]);

  const yAxisTickFormatter = (val) => `${symbol} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid opacity={0.2} vertical={false} stroke={HEX_COLORS.text} />
        {Object.keys(data).map((category) => (
          <Line
            type="monotone"
            strokeWidth={2}
            dot={false}
            key={category}
            name={category}
            dataKey={`values.${category}`}
            stroke={color({
              luminosity: 'bright',
              hue: 'aqua',
              seed: category,
            })}
          />
        ))}

        <YAxis
          axisLine={false}
          tickLine={false}
          tickCount={3}
          tick={{ fontSize: 10 }}
          width={45}
          stroke={HEX_COLORS.text}
          tickFormatter={yAxisTickFormatter}
        />
        <XAxis hide dataKey="date" axisLine={false} tickLine={false} stroke={HEX_COLORS.text} />

        <Legend iconType="square" verticalAlign="top" />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

TransactionCategoriesTimeline.propTypes = {
  data: PropTypes.array,
};

export default TransactionCategoriesTimeline;
