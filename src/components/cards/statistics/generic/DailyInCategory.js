import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/generic/Card';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import PercentageSinceLastPeriodMessage from 'src/components/messages/PercentageSinceLastPeriodMessage';
import MoneyValue from 'src/components/MoneyValue';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const DailyInCategory = ({
  isLoading,
  model,
  type,
  category,
  footerType,
  title,
}) => {
  const diffInDays = model.diffIn('days');
  const previousPeriod = model.generatePreviousPeriod();
  const current = Math.abs(model.data.current) / diffInDays;
  const previous = Math.abs(model.data.previous) / (previousPeriod.to.diff(previousPeriod.from, 'days') + 1);

  const footer = useMemo(() => {
    const period = model.generateSincePreviousPeriodText();

    if (footerType === 'percentage') {
      return (
        <PercentageSinceLastPeriodMessage
          inverted={type === EXPENSE_TYPE}
          period={period}
          current={current}
          previous={previous}
        />
      );
    }

    return (
      <AmountSinceLastPeriodMessage
        inverted={type === INCOME_TYPE}
        period={period}
        current={current}
        previous={previous}
      />
    );
  }, [footerType, current, previous]);

  return (
    <SimpleStatisticsCard
      title={title || `Daily ${type}s in: ${category}`}
      isLoading={isLoading}
      content={<MoneyValue bold maximumFractionDigits={0} amount={current} />}
      footer={footer}
    />
  );
};

DailyInCategory.defaultProps = {
  footerType: 'percentage',
  title: undefined,
};

DailyInCategory.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  category: PropTypes.string.isRequired,
  type: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]).isRequired,
  footerType: PropTypes.oneOf(['percentage', 'amount']),
  title: PropTypes.node,
};

export default DailyInCategory;
