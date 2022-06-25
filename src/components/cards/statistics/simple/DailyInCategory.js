import moment from 'moment-timezone';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import MoneyValue from 'src/components/MoneyValue';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

/**
 * TODO: Footer can be of 2 types: amount || percentage
 * TODO: Previous period should be parametric
 */
const DailyInCategory = ({
  isLoading,
  model,
  type,
  category,
}) => {
  const diffInDays = model.diffIn('days');

  const previousYear = model.from.year() - 1;
  const previousPeriodText = useMemo(
    () => (previousYear === moment().year() - 1) ? `last year(${previousYear})` : previousYear,
    [previousYear],
  );

  return (
    <SimpleStatisticsCard
      title={`Daily ${type}s in: ${category}`}
      isLoading={isLoading}
      content={(
        <MoneyValue
          bold
          maximumFractionDigits={0}
          amount={model.data.current / diffInDays}
        />
      )}
      footer={(
        <AmountSinceLastPeriodMessage
          period={previousPeriodText}
          previous={model.data.previous / diffInDays}
          current={model.data.current / diffInDays}
        />
      )}
    />
  );
};

DailyInCategory.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  category: PropTypes.string.isRequired,
  type: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]).isRequired,
};

export default DailyInCategory;
