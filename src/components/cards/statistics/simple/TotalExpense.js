import moment from 'moment-timezone';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import MoneyValue from 'src/components/MoneyValue';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const TotalExpense = ({ isLoading, model }) => {
  const previousYear = model.from.year() - 1;
  const previousPeriodText = useMemo(
    () => (previousYear === moment().year() - 1) ? `last year(${previousYear})` : previousYear,
    [previousYear],
  );

  return (
    <SimpleStatisticsCard
      isLoading={isLoading}
      title="Total Expense"
      content={(
        <MoneyValue
          bold
          amount={model.data.current}
          maximumFractionDigits={0}
        />
      )}
      footer={(
        <AmountSinceLastPeriodMessage
          period={previousPeriodText}
          previous={model.data.previous}
          current={model.data.current}
        />
      )}
    />
  );
};

TotalExpense.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
};

export default TotalExpense;
