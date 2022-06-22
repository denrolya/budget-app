import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import ExpenseCategoriesByWeekdays from 'src/components/charts/recharts/bar/ExpenseCategoriesByWeekdays';

const CategoryExpensesByWeekdaysCard = ({ isLoading, model, onUpdate }) => {
  const [isFilteredDataSelected, setIsFilteredDataSelected] = useState(false);
  const { data } = model;

  return (
    <TimeperiodStatisticsCard
      className="card-chart card--hover-expand"
      title="Days in week expenses"
      showControls={false}
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <ExpenseCategoriesByWeekdays topCategories={isFilteredDataSelected} data={data} />

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
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default memo(CategoryExpensesByWeekdaysCard);
