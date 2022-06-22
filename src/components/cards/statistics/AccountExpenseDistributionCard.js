import isEqual from 'lodash/isEqual';
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import AccountsExpenseDistribution from 'src/components/charts/recharts/pie/AccountsExpenseDistribution';

const AccountDistributionCard = ({
  isLoading,
  height,
  model,
  onUpdate,
}) => {
  const data = useMemo(() => sortBy(model.data, 'value'), [model.data]);

  return (
    <TimeperiodStatisticsCard
      className="card-chart card--hover-expand"
      title="Account distribution"
      showControls={false}
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <AccountsExpenseDistribution data={data} height={height} />
    </TimeperiodStatisticsCard>
  );
};

AccountDistributionCard.defaultProps = {
  height: 300,
  isLoading: false,
};

AccountDistributionCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  height: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default memo(
  AccountDistributionCard,
  (prevProps, nextProps) => isEqual(prevProps.model.data, nextProps.model.data) && isEqual(prevProps.isLoading, nextProps.isLoading),
);
