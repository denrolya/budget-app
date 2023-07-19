import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Card } from 'reactstrap';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  YAxis,
} from 'recharts';
import maxBy from 'lodash/maxBy';
import sum from 'lodash/sum';

import MoneyValue from 'src/components/MoneyValue';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { useCategories } from 'src/contexts/CategoriesContext';

const ExpenseCategoriesByWeekdays = ({ topCategories, data }) => {
  const [chartData, setChartData] = useState([]);
  const { symbol } = useBaseCurrency();
  const categories = useCategories();

  const findMaxKeyValuePair = (valuesObject) => {
    const maxValue = maxBy(Object.values(valuesObject), (value) => value);
    const maxKey = Object.keys(valuesObject).find((key) => valuesObject[key] === maxValue);
    return { [maxKey]: maxValue };
  };

  useEffect(() => {
    const updateChartData = () => {
      if (topCategories) {
        const updatedData = data.map((element) => ({
          ...element,
          values: findMaxKeyValuePair(element.values),
        }));
        setChartData(updatedData);
      } else {
        setChartData(data);
      }
    };

    updateChartData();
  }, [data, topCategories]);

  const yAxisTickFormatter = (val) => `${symbol} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const tooltipFormatter = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
      return null;
    }

    const { values } = payload[0].payload;
    const dayOfWeek = moment().isoWeekday(label + 1).format('dddd');
    const total = sum(Object.values(values));

    const tooltipItems = Object.keys(values)
      .reverse()
      .map((categoryName) => {
        const category = categories.find(({ name }) => categoryName === name);

        if (!category) return null;

        return (
          <p
            className="mb-0"
            key={category.name}
            style={{
              color: category.color,
            }}
          >
            <i aria-hidden className={category.icon} />
            {` ${category.name}: `}
            <MoneyValue bold amount={values[category.name]} />
          </p>
        );
      })
      .filter((item) => item !== null);

    return (
      <Card body className="px-3 py-2">
        <h4 className="mb-1">
          <i aria-hidden className="ion-ios-calendar" />
          {' '}
          {dayOfWeek}
          { ': ' }
          <MoneyValue bold amount={total} />
        </h4>
        {tooltipItems}
      </Card>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={0} padding={0}>
        <CartesianGrid opacity={0.1} vertical={false} />
        {Object.keys(data[0].values).map((categoryName) => {
          const category = categories.find(({ name }) => categoryName === name);

          return (
            <Bar
              stackId="a"
              key={`bar-${category.name}`}
              dataKey={`values.${category.name}`}
              fill={`${category.color}33`}
              stroke={category.color}
              strokeWidth={2}
            />
          );
        })}
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
