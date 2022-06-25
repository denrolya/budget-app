import moment from 'moment-timezone';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import MoneyValue from 'src/components/MoneyValue';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const DailyIncome = ({ isLoading, model }) => {
  const diffInDays = model.diffIn('days');
  const previousYear = model.from.year() - 1;
  const previousPeriodText = useMemo(
    () => (previousYear === moment().year() - 1) ? `last year(${previousYear})` : previousYear,
    [previousYear],
  );

  return (
    <SimpleStatisticsCard
      isLoading={isLoading}
      title="Daily income"
      content={(
        <MoneyValue
          bold
          maximumFractionDigits={0}
          amount={model.data.current / diffInDays}
        />
      )}
      footer={(
        <AmountSinceLastPeriodMessage
          invertedColors
          period={previousPeriodText}
          previous={model.data.previous / diffInDays}
          current={model.data.current / diffInDays}
        />
      )}
    />
  );
};

DailyIncome.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
};

export default DailyIncome;
