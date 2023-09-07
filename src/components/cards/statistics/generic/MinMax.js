import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SimpleStatisticsCard from 'src/components/cards/statistics/generic/Card';
import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import { API } from 'src/constants/api';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { fetchStatistics } from 'src/store/actions/statistics';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: API.valueByPeriod,
  transactionType: EXPENSE_TYPE,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
  interval: '1 month',
  categories: [],
  accounts: [],
};

const MinMax = ({
  fetchStatistics,
  config,
  updateStatisticsTrigger,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(new TimeperiodIntervalStatistics({
    from: config.after,
    to: config.before,
    interval: config.interval,
    data: {
      min: {
        after: 1640995200,
        before: 1643673600,
        expense: 13,
        income: 13,
      },
      max: {
        after: 1651363200,
        before: 1654041600,
        expense: 400,
        income: 400,
      },
    },
  }));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const params = {
        after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
        before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        interval: model.interval,
        categories: config.categories,
        accounts: config.accounts,
      };
      const data = await fetchStatistics({
        ...config,
        params,
      });
      const currentDate = moment().endOf('day');
      setModel(model.set('data', {
        min: data.reduce((minObj, currentObj) => {
          if (moment.unix(currentObj.before).isBefore(currentDate) && currentObj[config.transactionType] < minObj[config.transactionType]) {
            return currentObj;
          }
          return minObj;
        }),
        max: data.reduce((minObj, currentObj) => {
          if (moment.unix(currentObj.before).isBefore(currentDate) && currentObj[config.transactionType] > minObj[config.transactionType]) {
            return currentObj;
          }
          return minObj;
        }),
      }));
      setIsLoading(false);
    };

    fetchData();
  }, [
    model.from.format(MOMENT_DATETIME_FORMAT),
    model.to.format(MOMENT_DATETIME_FORMAT),
    model.interval,
    updateStatisticsTrigger]);

  useEffect(() => {
    setModel(model.merge({
      from: config.after,
      to: config.before,
      interval: config.interval,
    }));
  }, [config.after, config.before, config.interval]);

  return (
    <SimpleStatisticsCard
      title="Minimum & Maximum"
      isLoading={isLoading}
      content={(
        <>
          <MoneyValue bold maximumFractionDigits={0} amount={model.data.min[config.transactionType]} />
          { ' - ' }
          <MoneyValue bold maximumFractionDigits={0} amount={model.data.max[config.transactionType]} />
        </>
      )}
      footer={(
        <>
          { moment.unix(model.data.min.after).format('MMMM') }
          { ' - ' }
          { moment.unix(model.data.max.after).format('MMMM') }
        </>
      )}
    />
  );
};

MinMax.defaultProps = {
  config: DEFAULT_CONFIG,
  updateStatisticsTrigger: false,
};

MinMax.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    interval: PropTypes.string,
    accounts: PropTypes.arrayOf(PropTypes.number),
    categories: PropTypes.arrayOf(PropTypes.number),
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = ({ ui }) => ({
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(MinMax);
