import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer, BarChart, Bar, Tooltip, YAxis, XAxis, CartesianGrid, Legend,
} from 'recharts';
import color from 'randomcolor';
import { Card } from 'reactstrap';

import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/color';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const CustomTooltip = ({ active, payload }) => {
  if (!active) {
    return null;
  }

  const { date, values } = payload[0].payload;
  const categories = Object.keys(values);

  return (
    <Card body className="px-3 py-2">
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
  active: PropTypes.bool,
  payload: PropTypes.array,
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
      <BarChart data={chartData}>
        <defs>
          <filter id="shadow" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="blur" />
            <feOffset in="blur" dx="0" dy="7" result="offsetBlur" />
            <feFlood floodColor="#000000" floodOpacity="0.5" result="offsetColor" />
            <feComposite
              in="offsetColor"
              in2="offsetBlur"
              operator="in"
              result="offsetBlur"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid opacity={0.2} vertical={false} stroke={HEX_COLORS.text} />
        {Object.keys(data).map((category) => (
          <Bar
            type="monotone"
            strokeWidth={2}
            fillOpacity={1}
            filter="url(#shadow)"
            dot={false}
            key={category}
            name={category}
            dataKey={`values.${category}`}
            stroke={color({
              luminosity: 'dark',
              seed: category,
            })}
            fill={color({
              luminosity: 'dark',
              seed: category,
            })}
          />
        ))}

        <YAxis
          axisLine={false}
          tickLine={false}
          tickCount={3}
          tick={{ fontSize: 9 }}
          width={45}
          stroke={HEX_COLORS.text}
          tickFormatter={yAxisTickFormatter}
        />
        <XAxis hide dataKey="date" axisLine={false} tickLine={false} stroke={HEX_COLORS.text} />

        <Legend iconType="square" verticalAlign="top" />
        <Tooltip cursor={false} content={<CustomTooltip />} />
      </BarChart>
    </ResponsiveContainer>
  );
};

TransactionCategoriesTimeline.propTypes = {
  data: PropTypes.object,
};

export default TransactionCategoriesTimeline;
