import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { memo } from 'react';

import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TransactionCategoriesComparison from 'src/components/charts/recharts/bar/TransactionCategoriesComparison';

const ExpenseCategoriesReviewCard = ({
  isLoading, model, onUpdate,
}) => {
  const { data, from } = model;

  return (
    <TimeperiodStatisticsCard
      title="Main expense categories"
      className="card-chart card--hover-expand"
      showControls={false}
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <TransactionCategoriesComparison data={data} selectedYear={from.year()} />
    </TimeperiodStatisticsCard>
  );
};

ExpenseCategoriesReviewCard.defaultProps = {
  isLoading: false,
};

ExpenseCategoriesReviewCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default memo(
  ExpenseCategoriesReviewCard,
  (pp, np) => isEqual(pp.model.data, np.model.data) && isEqual(pp.isLoading, np.isLoading),
);
