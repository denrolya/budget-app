import moment from 'moment-timezone';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import MoneyValue from 'src/components/MoneyValue';
import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const TotalIncome = ({ isLoading, model }) => {
  const { from, to, data } = model;
  const diffInDays = useMemo(
    () => model.diffIn('days'),
    [from, to],
  );
  const previousYear = from.year() - 1;
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
          amount={data.current / diffInDays}
        />
      )}
      footer={(
        <AmountSinceLastPeriodMessage
          invertedColors
          period={previousPeriodText}
          previous={data.previous / diffInDays}
          current={data.current / diffInDays}
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
