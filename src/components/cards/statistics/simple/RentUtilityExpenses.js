import React from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import { generateLinkToExpenses } from 'src/utils/routing';

const RentUtilityExpenses = ({ isLoading, model }) => {
  const { from, to, data } = model;
  const current = Math.abs(data.current);
  const previous = Math.abs(data.previous);
  const linkToExpenses = generateLinkToExpenses(
    from.format(MOMENT_DATE_FORMAT),
    to.format(MOMENT_DATE_FORMAT),
    null,
    [2, 18],
  );

  return (
    <SimpleStatisticsCard
      title="Rent & Utilities"
      isLoading={isLoading}
      link={linkToExpenses}
      content={<MoneyValue bold maximumFractionDigits={0} amount={current} />}
      footer={<AmountSinceLastPeriodMessage current={current} previous={previous} />}
    />
  );
};

RentUtilityExpenses.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
};

export default RentUtilityExpenses;
