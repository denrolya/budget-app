import React, {
  useEffect, useMemo, useState,
} from 'react';
import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';

import GeneralAreaChart from 'src/components/charts/recharts/area/GeneralAreaChart';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { useAccounts } from 'src/contexts/AccountsContext';
import { useCategories } from 'src/contexts/CategoriesContext';
import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import { API } from 'src/constants/api';
import { fetchStatistics } from 'src/store/actions/statistics';
import { diffIn, generatePreviousPeriod, generateSincePreviousPeriodText } from 'src/utils/datetime';
import SimpleStatisticsCard from 'src/components/cards/statistics/generic/Card';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';
import PercentageSinceLastPeriodMessage from 'src/components/messages/PercentageSinceLastPeriodMessage';
import MoneyValue from 'src/components/MoneyValue';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  transactionType: EXPENSE_TYPE,
  path: API.valueByPeriod,
  footerType: 'percentage',
  type: 'total',
  after: moment().startOf('month'),
  before: moment().endOf('month'),
  accounts: [],
  categories: [],
  interval: null,
};

const TotalValue = ({
  updateStatisticsTrigger,
  fetchStatistics,
  config,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  let isMounted = false;
  const categories = useCategories();
  const accounts = useAccounts();
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(new TimeperiodIntervalStatistics({
    data: {
      value: {
        current: 0,
        previous: 0,
      },
      dataByRange: {
        current: [],
        previous: [],
      },
    },
    interval: config.interval,
    from: moment.isMoment(config.after) ? config.after : moment(config.after),
    to: moment.isMoment(config.before) ? config.before : moment(config.before),
  }));

  const { data: { value: { current, previous } } } = model;
  const { type, transactionType, footerType } = config;

  const footer = useMemo(() => {
    const period = generateSincePreviousPeriodText(model.from, model.to);

    switch (footerType) {
      case 'percentage':
        return (
          <PercentageSinceLastPeriodMessage
            inverted={transactionType === INCOME_TYPE}
            period={period}
            current={current}
            previous={previous}
          />
        );
      case 'chart':
        return <GeneralAreaChart name={config.name} data={model.data.dataByRange.current} />;
      case 'amount':
      default:
        return (
          <AmountSinceLastPeriodMessage
            inverted={transactionType === EXPENSE_TYPE}
            period={period}
            current={current}
            previous={previous}
          />
        );
    }
  }, [footerType, current, previous]);

  const title = useMemo(() => {
    if (config.categories?.length > 0) {
      return (
        <>
          {config.type === 'daily' && 'Daily in '}
          {config.categories.map((categoryId, index) => {
            const category = categories.find(({ id }) => id === categoryId);
            const isLastCategory = index === config.categories.length - 1;

            return (
              <React.Fragment key={categoryId}>
                {index > 0 && (isLastCategory ? ' & ' : ', ')}
                {category.name}
                {' '}
                <i aria-hidden className={category.icon} style={{ color: category.color }} />
              </React.Fragment>
            );
          })}
        </>
      );
    }

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
      setIsLoading(true);
      const params = {
        categories: config.categories,
        accounts: config.accounts,
        type: config.transactionType,
        interval: model.interval,
        after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
        before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
      };

      const selectedPeriodData = await fetchStatistics({ ...config, params });
      const selectedPeriodValue = sumBy(selectedPeriodData, config.transactionType);

      const previousPeriod = generatePreviousPeriod(model.from, model.to, true);
      const previousPeriodData = await fetchStatistics({
        ...config,
        params: {
          categories: config.categories,
          accounts: config.accounts,
          type: config.transactionType,
          interval: model.interval,
          after: previousPeriod.from.format(MOMENT_DEFAULT_DATE_FORMAT),
          before: previousPeriod.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        },
      });
      const previousPeriodValue = sumBy(previousPeriodData, config.transactionType);

      if (isMounted) {
        switch (type) {
          case 'daily':
            // eslint-disable-next-line no-case-declarations
            setModel(model.set('data', {
              value: {
                current: selectedPeriodValue / diffIn(model.from, model.to, 'days'),
                previous: previousPeriodValue / diffIn(previousPeriod.from, previousPeriod.to, 'days'),
              },
              dataByRange: {
                current: selectedPeriodData.map((e) => ({ ...e, [config.transactionType]: e[config.transactionType] / diffIn(model.from, model.to, 'days') })),
                previous: previousPeriodData.map((e) => ({ ...e, [config.transactionType]: e[config.transactionType] / diffIn(model.from, model.to, 'days') })),
              },
            }));
            break;
          case 'total':
          default:
            setModel(model.set('data', {
              value: {
                current: selectedPeriodValue,
                previous: previousPeriodValue,
              },
              dataByRange: {
                current: selectedPeriodData,
                previous: previousPeriodData,
              },
            }));
            break;
        }
      }
      setIsLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false; // Set it to false when the component is unmounted
    };
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), model.interval, updateStatisticsTrigger]);

  useEffect(() => {
    setModel(model.merge({
      from: config.after,
      to: config.before,
      interval: config.interval,
    }));
  }, [config.after, config.before, config.interval]);

  return (
    <SimpleStatisticsCard
      title={title}
      isLoading={isLoading}
      footerPadding={config.footerType !== 'chart'}
      content={(
        <MoneyValue bold showSign={false} maximumFractionDigits={0} amount={model.data.value.current} />
      )}
      footer={footer}
    />
  );
};

TotalValue.defaultProps = {
  config: DEFAULT_CONFIG,
  updateStatisticsTrigger: false,
};

TotalValue.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
    path: PropTypes.string,
    type: PropTypes.oneOf(['total', 'daily']),
    footerType: PropTypes.oneOf(['percentage', 'amount', 'chart']),
    chartConfig: PropTypes.shape({
      type: PropTypes.oneOf(['line', 'bar']),
    }),
    categories: PropTypes.array,
    accounts: PropTypes.array,
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    interval: PropTypes.string,
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = ({ ui }) => ({
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(TotalValue);
