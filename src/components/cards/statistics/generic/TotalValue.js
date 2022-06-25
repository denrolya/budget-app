import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/generic/Card';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import PercentageSinceLastPeriodMessage from 'src/components/messages/PercentageSinceLastPeriodMessage';
import MoneyValue from 'src/components/MoneyValue';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';

const TotalValue = ({
  isLoading,
  type,
  model,
  footerType,
  title,
}) => {
  const { data: { current, previous } } = model;

  const footer = useMemo(() => {
    const period = model.generateSincePreviousPeriodText();

    if (footerType === 'percentage') {
      return (
        <PercentageSinceLastPeriodMessage
          invertedColors={type === INCOME_TYPE}
          period={period}
          current={current}
          previous={previous}
        />
      );
    }

    return (
      <AmountSinceLastPeriodMessage
        invertedColors={type === INCOME_TYPE}
        period={period}
        current={current}
        previous={previous}
      />
    );
  }, [footerType, current, previous]);

  return (
    <SimpleStatisticsCard
      title={title || `Total ${type}e`}
      isLoading={isLoading}
      content={<MoneyValue bold maximumFractionDigits={0} amount={model.data.current} />}
      footer={footer}
    />
  );
};

TotalValue.defaultProps = {
  footerType: 'percentage',
  title: undefined,
};

TotalValue.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  type: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]).isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  footerType: PropTypes.oneOf(['percentage', 'amount']),
  title: PropTypes.node,
};

export default TotalValue;
