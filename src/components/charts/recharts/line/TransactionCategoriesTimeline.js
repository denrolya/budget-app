import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  YAxis,
  XAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card } from 'reactstrap';

import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/color';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { useCategories } from 'src/contexts/CategoriesContext';

const TransactionCategoriesTimeline = ({ data }) => {
  const { symbol } = useBaseCurrency();
  const categories = useCategories();
  const [chartData, setChartData] = useState();

  useEffect(() => {
    const selectedCategories = Object.keys(data);
    const dates = data[selectedCategories[0]].map(({ date }) => date);

    const test = dates.map((date, index) => {
      const result = {
        date,
        values: {},
      };

      selectedCategories.forEach((category) => {
        result.values[category] = data[category][index].value;
      });

      return result;
    });

    setChartData(test);
  }, [data]);

  const yAxisTickFormatter = (val) => `${symbol} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const tooltipFormatter = ({ active, payload }) => {
    if (!active || !payload?.length) {
      return null;
    }

    const { date, values } = payload[0].payload;
    const selectedCategories = Object.keys(values);

    return (
      <Card body className="px-3 py-2">
        <h4 className="mb-1 text-white">
          <i aria-hidden className="ion-ios-calendar" />
          {' '}
          {moment.unix(date).format('MMMM')}
        </h4>
        {selectedCategories
          .map((categoryName) => categories.find(({ name }) => name === categoryName))
          .map(({ name, color }) => (
            <p className="mb-0" key={`tooltip-category-${name}`}>
              {name}
              {': '}
              <span style={{ color }}>
                <MoneyValue bold amount={values[name]} maximumFractionDigits={0} />
              </span>
            </p>
          ))}
      </Card>
    );
  };

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
        {Object
          .keys(data)
          .map((categoryName) => categories.find(({ name }) => name === categoryName))
          .map(({ name, color }) => (
            <Bar
              type="monotone"
              strokeWidth={2}
              fillOpacity={1}
              filter="url(#shadow)"
              dot={false}
              radius={[8, 8, 8, 8]}
              key={name}
              name={name}
              dataKey={`values.${name}`}
              stroke={color}
              fill={`${color}33`}
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
        <Tooltip cursor={false} content={tooltipFormatter} />
      </BarChart>
    </ResponsiveContainer>
  );
};

TransactionCategoriesTimeline.propTypes = {
  data: PropTypes.object,
};

export default TransactionCategoriesTimeline;
