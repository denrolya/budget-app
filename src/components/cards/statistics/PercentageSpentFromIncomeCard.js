import isEqual from 'lodash/isEqual';
import React, { memo } from 'react';
import PropTypes from 'prop-types';

import IconStatisticsCard from 'src/components/cards/statistics/IconStatisticsCard';

const PercentageSpentFromIncomeCard = ({ isLoading, percentage }) => {
  let icon = 'ion-ios-volume-low';
  let color = 'info';

  if (percentage < 10) {
    icon = 'ion-ios-volume-off';
    color = 'info';
  } else if (percentage >= 10 && percentage < 20) {
    icon = 'ion-ios-volume-mute';
    color = 'success';
  } else if (percentage >= 20 && percentage < 30) {
    icon = 'ion-ios-volume-low';
    color = 'warning';
  } else if (percentage >= 30) {
    icon = 'ion-ios-volume-high';
    color = 'danger';
  }

  return (
    <IconStatisticsCard
      title="Spent from income"
      content={`% ${percentage}`}
      isLoading={isLoading}
      icon={icon}
      color={color}
    />
  );
};

PercentageSpentFromIncomeCard.defaultProps = {
  isLoading: false,
};

PercentageSpentFromIncomeCard.propTypes = {
  percentage: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
};

export default memo(
  PercentageSpentFromIncomeCard,
  (prevProps, nextProps) => isEqual(prevProps.percentage, nextProps.percentage) && isEqual(prevProps.isLoading, nextProps.isLoading),
);
