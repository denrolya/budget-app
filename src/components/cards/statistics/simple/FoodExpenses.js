import React from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import PercentageSinceLastMonthMessage from 'src/components/messages/PercentageSinceLastMonthMessage';
import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import { generateLinkToExpenses } from 'src/utils/routing';

const FoodExpenses = ({ isLoading, model }) => {
  const { from, to, data } = model;
  const current = Math.abs(data.current);
  const previous = Math.abs(data.previous);
  const linkToExpenses = generateLinkToExpenses(
    from.format(MOMENT_DATE_FORMAT),
    to.format(MOMENT_DATE_FORMAT),
    null,
    [1],
  );

  return (
    <SimpleStatisticsCard
      title="Food expenses"
      isLoading={isLoading}
      content={<MoneyValue bold maximumFractionDigits={0} amount={current} />}
      footer={<PercentageSinceLastMonthMessage previous={previous} current={current} />}
      link={linkToExpenses}
    />
  );
};

FoodExpenses.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
};

export default FoodExpenses;
