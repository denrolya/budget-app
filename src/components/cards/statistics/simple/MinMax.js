import moment from 'moment-timezone';
import React from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import MoneyValue from 'src/components/MoneyValue';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const MinMax = ({ isLoading, model }) => (
  <SimpleStatisticsCard
    title="Minimum & Maximum"
    isLoading={isLoading}
    content={(
      <>
        <MoneyValue bold maximumFractionDigits={0} amount={model.data.min.value} />
        {' - '}
        <MoneyValue bold maximumFractionDigits={0} amount={model.data.max.value} />
      </>
    )}
    footer={(
      <>
        {moment(model.data.min.when).format('MMMM')}
        {' - '}
        {moment(model.data.max.when).format('MMMM')}
      </>
    )}
  />
);

MinMax.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
};

export default MinMax;
