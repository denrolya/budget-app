import React from 'react';
import PropTypes from 'prop-types';

import IconStatisticsCard from 'src/components/cards/statistics/icon/Card';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const MainIncomeSourceCard = ({ isLoading, model }) => {
  let max = 0;
  let category;
  model.data.walk((c) => {
    if (c.model.value >= max) {
      max = c.model.value;
      category = c.model;
    }
  });

  return (
    <IconStatisticsCard
      title="Main income source"
      color="success"
      className="card--hover-expand"
      isLoading={isLoading}
      content={category.name}
      icon={category.icon}
    />
  );
};

MainIncomeSourceCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
};

export default MainIncomeSourceCard;
