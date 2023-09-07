import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import meanBy from 'lodash/meanBy';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import SimpleStatisticsCard from 'src/components/cards/statistics/generic/Card';
import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import { PATHS } from 'src/constants/statistics';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import { useCategories } from 'src/contexts/CategoriesContext';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { fetchStatistics } from 'src/store/actions/statistics';
import { isActionLoading } from 'src/utils/common';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  transactionType: EXPENSE_TYPE,
  path: PATHS.avg,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
  interval: '1 week',
  categories: [],
  accounts: [],
};

// TODO: Style table as in daily expenses
// TODO: Display interval somewhere
const AverageInCategory = ({
  isLoading, updateStatisticsTrigger, fetchStatistics, config,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [model, setModel] = useState(new TimeperiodIntervalStatistics({
    data: 0,
    from: config.after,
    to: config.before,
    interval: config.interval,
  }));

  const categories = useCategories();

  if (config.categories.length === 0 || config.categories.length > 1) {
    // TODO: Display error
  }

  const category = categories.find((c) => c.id === config.categories[0]);
  const title = (
    <>
      Average in
      {' '}
      {category.name}
      {' '}
      <i aria-hidden className={category.icon} style={{ color: category.color }} />
    </>
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStatistics({
        ...config,
        params: {
          interval: model.interval,
          type: config.transactionType,
          after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
          before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
          categories: config.categories,
          accounts: config.accounts,
        },
      });

      setModel(model.set(
        'data',
        meanBy(
          data.filter(
            ({ date }) => moment.unix(date).isBefore(moment()),
          ),
          'value',
        ),
      ));
    };

    fetchData();
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
      content={
        <MoneyValue bold maximumFractionDigits={0} amount={model.data} />
      }
    />
  );
};

AverageInCategory.defaultProps = {
  config: DEFAULT_CONFIG,
  isLoading: false,
  updateStatisticsTrigger: false,
};

AverageInCategory.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    transactionType: PropTypes.oneOf([INCOME_TYPE, EXPENSE_TYPE]),
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    interval: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    categories: PropTypes.array,
    accounts: PropTypes.array,
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ ui }, { config }) => ({
  isLoading: isActionLoading(ui[`STATISTICS_FETCH_${upperCase(snakeCase(config.name))}`]),
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(AverageInCategory);
