import moment from 'moment-timezone';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import MoneyValue from 'src/components/MoneyValue';
import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const TotalIncome = ({ isLoading, model }) => {
  const previousYear = model.from.year() - 1;
  const previousPeriodText = useMemo(
    () => (previousYear === moment().year() - 1) ? `last year(${previousYear})` : previousYear,
    [previousYear],
  );

  return (
    <SimpleStatisticsCard
      title="Total Income"
      isLoading={isLoading}
      content={
        <MoneyValue bold maximumFractionDigits={0} amount={model.data.current} />
      }
      footer={(
        <AmountSinceLastPeriodMessage
          invertedColors
          period={previousPeriodText}
          previous={model.data.previous}
          current={model.data.current}
        />
      )}
    />
  );
};

TotalIncome.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
};

export default TotalIncome;
