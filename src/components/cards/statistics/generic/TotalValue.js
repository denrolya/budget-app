import React, {
  useEffect, useMemo, useState,
} from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import { useAccounts } from 'src/contexts/AccountsContext';
import { useCategories } from 'src/contexts/CategoriesContext';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { PATHS } from 'src/constants/statistics';
import { fetchStatistics } from 'src/store/actions/statistics';
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
  after: moment().startOf('month'),
  before: moment().endOf('month'),
  accounts: [],
  categories: [],
};

const TotalValue = ({
  isLoading,
  updateStatisticsTrigger,
  fetchStatistics,
  config,
}) => {
  let isMounted = false;
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const categories = useCategories();
  const accounts = useAccounts();
  const [model, setModel] = useState(new TimeperiodStatistics({
    data: {
      current: 0,
      previous: 0,
    },
    from: moment.isMoment(config.after) ? config.after : moment(config.after),
    to: moment.isMoment(config.before) ? config.before : moment(config.before),
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

  const title = useMemo(() => {
    const selectedCategoriesNames = config?.categories?.map((id) => categories.find((c) => c.id === id)?.name);
    const selectedAccountsNames = config?.accounts?.map((id) => accounts.find((c) => c.id === id)?.name);

    const inCategories = config.categories?.length ? `in ${selectedCategoriesNames.join(' & ')}` : '';
    const forAccounts = config.accounts?.length ? `for ${selectedAccountsNames.join(' & ')}` : '';

    return (
      <span className="text-capitalize">
        {`${type} ${transactionType}s ${inCategories} ${forAccounts}`}
      </span>
    );
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.from.format(MOMENT_DATETIME_FORMAT), type]);

  const diff = previous - current;

  useEffect(() => {
    isMounted = true;

    const fetchData = async () => {
      const params = {
        categoryDeep: config.categories,
        account: config.accounts,
        isDraft: false,
        type: config.transactionType,
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
          type: config.transactionType,
          'executedAt[after]': previousPeriod.from.format(MOMENT_DATETIME_FORMAT),
          'executedAt[before]': previousPeriod.to.format(MOMENT_DATETIME_FORMAT),
        },
      });

      if (isMounted) {
        switch (type) {
          case 'daily':
            // eslint-disable-next-line no-case-declarations
            setModel(model.set('data', {
              current: currentData / diffIn(model.from, model.to, 'days'),
              previous: previousPeriodData / diffIn(previousPeriod.from, previousPeriod.to, 'days'),
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
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Set it to false when the component is unmounted
    };
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), updateStatisticsTrigger]);

  useEffect(() => {
    setModel(model.merge({
      from: config.after,
      to: config.before,
    }));
  }, [config.after, config.before]);

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
  isLoading: false,
  updateStatisticsTrigger: false,
};

TotalValue.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
    path: PropTypes.string,
    type: PropTypes.oneOf(['total', 'daily']),
    footerType: PropTypes.oneOf(['percentage', 'amount']),
    categories: PropTypes.array,
    accounts: PropTypes.array,
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ ui }, { config }) => ({
  isLoading: isActionLoading(ui[`STATISTICS_FETCH_${upperCase(snakeCase(config.name))}`]),
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(TotalValue);
