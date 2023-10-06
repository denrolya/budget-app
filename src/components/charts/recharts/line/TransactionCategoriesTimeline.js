import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  YAxis,
  XAxis,
  CartesianGrid,
} from 'recharts';
import { Card } from 'reactstrap';

import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/color';
import { MOMENT_DATE_FORMAT, MOMENT_VIEW_DATE_FORMAT } from 'src/constants/datetime';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { useCategories } from 'src/contexts/CategoriesContext';

const TransactionCategoriesTimeline = ({ data, interval }) => {
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

    const { values } = payload[0].payload;
    const selectedCategories = Object.keys(values);
    const date = moment.unix(payload[0].payload.date);
    let dateString = '';

    switch (interval) {
      case '1 month':
        dateString = date.format(date.year() === moment().year() ? 'MMMM' : 'MMMM YY');
        break;
      case '1 week':
        dateString = `#${date.isoWeek()} ${date.format(date.year() === moment().year() ? 'MMMM' : 'MMMM YY')}`;
        break;
      case '1 day':
      default:
        dateString = date.format(date.year() === moment().year() ? MOMENT_VIEW_DATE_FORMAT : `${MOMENT_VIEW_DATE_FORMAT} YY`);
    }

    return (
      <Card body className="px-3 py-2">
        <h4 className="mb-1 text-white">
          <i aria-hidden className="ion-ios-calendar" />
          {' '}
          { dateString }
        </h4>
        {selectedCategories
          .map((categoryName) => categories.find(({ name }) => name === categoryName))
          .map(({ name, color, icon }) => (
            <p className="mb-0" key={`tooltip-category-${name}`}>
              <span style={{ color }}>
                <i aria-hidden="true" className={icon} />
                {' '}
                {name}
                {': '}
              </span>
              <span>
                <MoneyValue bold maximumFractionDigits={0} amount={values[name]} />
              </span>
            </p>
          ))}
      </Card>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart padding={0} margin={0} data={chartData}>
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
            <Line
              type="monotone"
              filter="url(#shadow)"
              strokeWidth={2}
              fillOpacity={1}
              radius={[8, 8, 0, 0]}
              dot={false}
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
          tickCount={5}
          tick={{ fontSize: 9 }}
          width={45}
          stroke={HEX_COLORS.text}
          tickFormatter={yAxisTickFormatter}
        />
        <XAxis hide dataKey="date" axisLine={false} tickLine={false} stroke={HEX_COLORS.text} />
        <Tooltip cursor={false} content={tooltipFormatter} />
      </LineChart>
    </ResponsiveContainer>
  );
};

TransactionCategoriesTimeline.defaultProps = {
  data: undefined,
};

TransactionCategoriesTimeline.propTypes = {
  data: PropTypes.object,
  interval: PropTypes.string.isRequired,
};

export default TransactionCategoriesTimeline;
