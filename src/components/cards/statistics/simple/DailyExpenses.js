import moment from 'moment-timezone';
import React from 'react';
import PropTypes from 'prop-types';

import PercentageSinceLastMonthMessage from 'src/components/messages/PercentageSinceLastMonthMessage';
import MoneyValue from 'src/components/MoneyValue';
import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const DailyExpenses = ({ isLoading, model }) => {
  const current = Math.abs(model.data.current) / moment().date();
  const previous = Math.abs(model.data.previous) / moment().subtract(1, 'month').daysInMonth();

  return (
    <SimpleStatisticsCard
      title="Daily expenses"
      isLoading={isLoading}
      content={<MoneyValue bold maximumFractionDigits={0} amount={current} />}
      footer={<PercentageSinceLastMonthMessage previous={previous} current={current} />}
    />
  );
};

DailyExpenses.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
};

export default DailyExpenses;
