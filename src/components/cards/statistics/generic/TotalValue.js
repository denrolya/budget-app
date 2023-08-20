import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { PATHS } from 'src/constants/statistics';
import { fetchNewStatistics as fetchStatistics } from 'src/store/actions/dashboard';
import { diffIn, generatePreviousPeriod, generateSincePreviousPeriodText } from 'src/utils/datetime';
import SimpleStatisticsCard from 'src/components/cards/statistics/generic/Card';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import PercentageSinceLastPeriodMessage from 'src/components/messages/PercentageSinceLastPeriodMessage';
import MoneyValue from 'src/components/MoneyValue';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import { isActionLoading } from 'src/utils/common';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  transactionType: EXPENSE_TYPE,
  path: PATHS.sum,
  footerType: 'percentage',
  type: 'total',
  accounts: [],
  categories: [],
};

// TODO: Generate title
// TODO: Add optional accounts & categories filters
const TotalValue = ({
  uiState,
  fetchStatistics,
  config,
}) => {
  const isLoading = isActionLoading(uiState[`DASHBOARD_FETCH_STATISTICS_${upperCase(snakeCase(config.name))}`]);
  const [model, setModel] = useState(new TimeperiodStatistics({
    data: {
      current: 0,
      previous: 0,
    },
  }));

  const { data: { current, previous } } = model;
  const { type, transactionType, footerType } = config;

  const footer = useMemo(() => {
    const period = generateSincePreviousPeriodText(model.from, model.to);

    return (footerType === 'percentage') ? (
      <PercentageSinceLastPeriodMessage
        inverted={transactionType === INCOME_TYPE}
        period={period}
        current={current}
        previous={previous}
      />
    ) : (
      <AmountSinceLastPeriodMessage
        inverted={transactionType === INCOME_TYPE}
        period={period}
        current={current}
        previous={previous}
      />
    );
  }, [footerType, current, previous]);

  const title = useMemo(() => (
    <span className="text-capitalize">
      {`${type} ${transactionType}s`}
    </span>
  ), [model.from.format(MOMENT_DATETIME_FORMAT), model.from.format(MOMENT_DATETIME_FORMAT), type]);

  const diff = previous - current;

  const fetchData = async () => {
    const params = {
      categoryDeep: config.categories,
      account: config.accounts,
      isDraft: false,
      'executedAt[after]': model.from.format(MOMENT_DATETIME_FORMAT),
      'executedAt[before]': model.to.format(MOMENT_DATETIME_FORMAT),
    };

    const currentData = await fetchStatistics({ ...config, params });

    const previousPeriod = generatePreviousPeriod(model.from, model.to);
    const previousPeriodData = await fetchStatistics({
      ...config,
      params: {
        categoryDeep: config.categories,
        account: config.accounts,
        isDraft: false,
        'executedAt[after]': previousPeriod.from.format(MOMENT_DATETIME_FORMAT),
        'executedAt[before]': previousPeriod.to.format(MOMENT_DATETIME_FORMAT),
      },
    });

    switch (type) {
      case 'daily':
        // eslint-disable-next-line no-case-declarations
        const diffInDays = diffIn(model.from, model.to, 'days');
        setModel(model.set('data', {
          current: currentData / diffInDays,
          previous: previousPeriodData / diffInDays,
        }));
        break;
      case 'total':
      default:
        setModel(model.set('data', {
          current: currentData,
          previous: previousPeriodData,
        }));
        break;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SimpleStatisticsCard
      title={title}
      isLoading={isLoading}
      content={(
        <>
          <i
            aria-hidden
            className={cn('strong', {
              'ion-ios-trending-down': diff > 0,
              'ion-ios-trending-up': diff < 0,
              'text-success': (diff > 0 && transactionType === EXPENSE_TYPE) || (diff < 0 && transactionType === INCOME_TYPE),
              'text-danger': (diff < 0 && transactionType === EXPENSE_TYPE) || (diff > 0 && transactionType === INCOME_TYPE),
            })}
          />
          {' '}
          <MoneyValue bold maximumFractionDigits={0} amount={model.data.current} />
        </>
      )}
      footer={footer}
    />
  );
};

TotalValue.defaultProps = {
  config: DEFAULT_CONFIG,
};

TotalValue.propTypes = {
  uiState: PropTypes.object.isRequired,
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]).isRequired,
    path: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['total', 'daily']),
    footerType: PropTypes.oneOf(['percentage', 'amount']),
    categories: PropTypes.array,
    accounts: PropTypes.array,
  }),
};

const mapStateToProps = ({ ui }) => ({ uiState: ui });

export default connect(mapStateToProps, { fetchStatistics })(TotalValue);
