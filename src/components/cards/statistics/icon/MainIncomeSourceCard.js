import React from 'react';
import PropTypes from 'prop-types';

import IconStatisticsCard from 'src/components/cards/statistics/icon/Card';

const MainIncomeSourceCard = ({ isLoading, category }) => (
  <IconStatisticsCard
    title="Main income source"
    color="success"
    className="card--hover-expand"
    isLoading={isLoading}
    content={category.name}
    icon={category.icon}
  />
);

MainIncomeSourceCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
  }).isRequired,
};

export default MainIncomeSourceCard;
