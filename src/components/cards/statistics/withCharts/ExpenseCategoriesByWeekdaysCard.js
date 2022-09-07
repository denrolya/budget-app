import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import ExpenseCategoriesByWeekdays from 'src/components/charts/recharts/bar/ExpenseCategoriesByWeekdays';

const CategoryExpensesByWeekdaysCard = ({ isLoading, model }) => {
  const [isFilteredDataSelected, setIsFilteredDataSelected] = useState(false);
  const [chartData, setChartData] = useState(model.data);

  useEffect(() => {
    const diffInDays = model.diffIn('days');

    setChartData(
      model.data.map(({ name, values }) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(values)) {
          // eslint-disable-next-line no-param-reassign
          values[key] = value / diffInDays;
        }
        return {
          name, values,
        };
      }),
    );
  }, [model.data]);

  return (
    <TimeperiodStatisticsCard
      header="Days in week expenses"
      className="card-chart"
      isLoading={isLoading || !chartData}
    >
      <ExpenseCategoriesByWeekdays topCategories={isFilteredDataSelected} data={chartData} />

      <Button
        block
        color="danger"
        size="sm"
        className="btn-simple"
        active={isFilteredDataSelected}
        onClick={() => setIsFilteredDataSelected(!isFilteredDataSelected)}
      >
        Show only top categories
      </Button>
    </TimeperiodStatisticsCard>
  );
};

CategoryExpensesByWeekdaysCard.defaultProps = {
  isLoading: false,
};

CategoryExpensesByWeekdaysCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  isLoading: PropTypes.bool,
};

export default memo(CategoryExpensesByWeekdaysCard);
