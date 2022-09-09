import cn from 'classnames';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import SimpleStatisticsCard from 'src/components/cards/statistics/generic/Card';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import PercentageSinceLastPeriodMessage from 'src/components/messages/PercentageSinceLastPeriodMessage';
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
  title,
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

  const footer = useMemo(() => {
    const period = model.generateSincePreviousPeriodText();

    if (footerType === 'percentage') {
      return (
        <PercentageSinceLastPeriodMessage
          inverted={type === INCOME_TYPE}
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

  const diff = previous - current;

  return (
    <SimpleStatisticsCard
      title={title || `${category} ${type}s`}
      isLoading={isLoading}
      content={(
        <>
          <i
            aria-hidden
            className={cn('strong', {
              'ion-ios-trending-down': diff > 0,
              'ion-ios-trending-up': diff < 0,
              'text-success': (diff > 0 && type === EXPENSE_TYPE) || (diff < 0 && type === INCOME_TYPE),
              'text-danger': (diff < 0 && type === EXPENSE_TYPE) || (diff > 0 && type === INCOME_TYPE),
            })}
          />
          {' '}
          <MoneyValue bold maximumFractionDigits={0} amount={current} />
        </>
      )}
      footer={footer}
      link={linkToExpenses}
    />
  );
};

TotalInCategory.defaultProps = {
  footerType: 'amount',
  title: undefined,
};

TotalInCategory.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  type: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]).isRequired,
  category: PropTypes.string.isRequired,
  footerType: PropTypes.oneOf(['amount', 'percentage']),
  title: PropTypes.node,
};

export default TotalInCategory;
