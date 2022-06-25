import moment from 'moment-timezone';
import React from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/generic/Card';
import MoneyValue from 'src/components/MoneyValue';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const AverageInCategory = ({
  isLoading,
  category,
  model,
  title,
}) => (
  <SimpleStatisticsCard
    title={title || `Average in: ${category}`}
    isLoading={isLoading}
    content={
      <MoneyValue bold maximumFractionDigits={0} amount={model.data.value} />
    }
    footer={(
      <>
        Mostly on
        {' '}
        {moment().isoWeekday(model.data.dayOfWeek).format('dddd')}
      </>
    )}
  />
);

AverageInCategory.defaultProps = {
  title: undefined,
};

AverageInCategory.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  category: PropTypes.string.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  title: PropTypes.node,
};

export default AverageInCategory;
