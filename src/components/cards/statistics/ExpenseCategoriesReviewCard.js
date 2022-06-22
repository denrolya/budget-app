import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { memo, useMemo } from 'react';

import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { useExpenseCategories } from 'src/contexts/CategoriesContext';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TransactionCategoriesComparison from 'src/components/charts/recharts/bar/TransactionCategoriesComparison';

const TAG_REPORT_NAME = 'report-main';

const ExpenseCategoriesReviewCard = ({
  isLoading,
  model,
  onUpdate,
}) => {
  const { from } = model;

  const expenseCategories = useExpenseCategories();
  const reportCategories = useMemo(
    () => expenseCategories.filter(({ tags }) => tags.some(({ name }) => name === TAG_REPORT_NAME)),
    [expenseCategories.length],
  );

  const data = reportCategories.map((c) => model.data.first(({ model: { name } }) => name === c.name)?.model);

  return (
    <TimeperiodStatisticsCard
      title="Main expense categories"
      className="card-chart"
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
  onUpdate: undefined,
};

ExpenseCategoriesReviewCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default memo(
  ExpenseCategoriesReviewCard,
  (pp, np) => isEqual(pp.model.data, np.model.data) && isEqual(pp.isLoading, np.isLoading),
);
