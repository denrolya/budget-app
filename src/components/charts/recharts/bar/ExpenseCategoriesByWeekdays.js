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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import maxBy from 'lodash/maxBy';
import sum from 'lodash/sum';

import MoneyValue from 'src/components/MoneyValue';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { useCategories } from 'src/contexts/CategoriesContext';
import { amountInPercentage } from 'src/utils/common';

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
    const data = Object.entries(values).map(([name, value]) => ({ name, value }));

    const tooltipItems = Object.keys(values)
      .map((categoryName) => {
        const category = categories.find(({ name }) => categoryName === name);
        const percentage = amountInPercentage(total, values[category.name]);

        if (!category) return null;

        return (
          <p
            className="mb-0"
            key={category.name}
            style={{
              color: category.color,
            }}
          >
            {percentage.toFixed()}
            {'% '}
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
          {': '}
          <MoneyValue bold amount={total} />
        </h4>
        <div className="row">
          <div className="col-xs-6">
            <PieChart width={200} height={200}>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry) => {
                  const category = categories.find(({ name }) => entry.name === name);
                  return <Cell key={`cell-${entry.name}`} stroke={category.color} fill={`${category.color}33`} />;
                })}
              </Pie>
            </PieChart>
          </div>
          <div className="col-xs-6">{tooltipItems}</div>
        </div>
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
