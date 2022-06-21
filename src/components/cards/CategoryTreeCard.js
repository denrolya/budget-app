import PropTypes from 'prop-types';
import React, { useState } from 'react';

import CategoriesList from 'src/components/CategoriesList';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import CenteredMessage from 'src/components/messages/CenteredMessage';
import TransactionCategories from 'src/components/charts/recharts/pie/TransactionCategories';

const CategoryTreeCard = ({
  isLoading, model, onUpdate, type,
}) => {
  const { from, to, data } = model;
  const [selectedCategory, selectCategory] = useState(data.model.name);

  if (!data.hasChildren()) {
    return (
      <CenteredMessage
        className="mb-4"
        title="No statistics available for selected period."
        message="Try to select another date range in upper right corner of this card."
      />
    );
  }

  return (
    <TimeperiodStatisticsCard
      className="card-category-tree"
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <div>
        <TransactionCategories data={data} selectedCategory={selectedCategory} onClick={selectCategory} />
      </div>
      <CategoriesList
        data={data}
        onCategorySelect={selectCategory}
        selectedCategory={selectedCategory}
        from={from}
        to={to}
        type={type}
      />
    </TimeperiodStatisticsCard>
  );
};

CategoryTreeCard.defaultProps = {
  isLoading: false,
  type: EXPENSE_TYPE,
};

CategoryTreeCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  type: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
};

export default CategoryTreeCard;
