import moment from 'moment-timezone';
import React from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/simple/Card';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import PercentageSinceLastMonthMessage from 'src/components/messages/PercentageSinceLastMonthMessage';
import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import { generateLinkToExpenses } from 'src/utils/routing';

const TotalInCategory = ({
  isLoading,
  model,
  type,
  category,
  footerType,
  footerPeriod,
}) => {
  const { from, to, data } = model;
  const current = Math.abs(data.current);
  const previous = Math.abs(data.previous);
  const linkToExpenses = generateLinkToExpenses(
    from.format(MOMENT_DATE_FORMAT),
    to.format(MOMENT_DATE_FORMAT),
    null,
    [1],
  );

  let message = <PercentageSinceLastMonthMessage previous={previous} current={current} />;

  if (footerPeriod === 'year') {
    const previousYear = from.year() - 1;
    message = (
      <AmountSinceLastPeriodMessage
        period={(previousYear === moment().year() - 1) ? `last year(${previousYear})` : previousYear}
        previous={model.data.previous}
        current={model.data.current}
      />
    );
  }

  return (
    <SimpleStatisticsCard
      title={`${category} ${type}s`}
      isLoading={isLoading}
      content={<MoneyValue bold maximumFractionDigits={0} amount={current} />}
      footer={message}
      link={linkToExpenses}
    />
  );
};

TotalInCategory.defaultProps = {
  footerPeriod: 'month',
  footerType: 'amount',
};

TotalInCategory.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  type: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]).isRequired,
  category: PropTypes.string.isRequired,
  footerType: PropTypes.oneOf(['amount', 'percentage']),
  footerPeriod: PropTypes.oneOf(['month', 'year']),
};

export default TotalInCategory;
