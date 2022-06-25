import moment from 'moment-timezone';
import React from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import MoneyValue from 'src/components/MoneyValue';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const Average = ({ isLoading, category, model }) => (
  <SimpleStatisticsCard
    title={`Average in: ${category}`}
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

Average.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  category: PropTypes.string.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
};

export default Average;
