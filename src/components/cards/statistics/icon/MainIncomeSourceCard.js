import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconStatisticsCard from 'src/components/cards/statistics/icon/Card';
import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import { PATHS } from 'src/constants/statistics';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { fetchStatistics } from 'src/store/actions/statistics';
import { isActionLoading } from 'src/utils/common';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: PATHS.topValueCategory,
  transactionType: INCOME_TYPE,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
};

const TopValueCategory = ({
  fetchStatistics,
  config,
  isLoading,
  updateStatisticsTrigger,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [model, setModel] = useState(new TimeperiodIntervalStatistics({
    from: config.after,
    to: config.before,
    data: {
      icon: 'ion-ios-download',
      name: 'Salary',
      value: 5000,
    },
  }));

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
        before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        type: config.transactionType,
      };
      const data = await fetchStatistics({ ...config, params });
      setModel(model.set('data', data));
    };

    fetchData();
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), model.interval, updateStatisticsTrigger]);

  useEffect(() => {
    setModel(model.merge({
      from: config.after,
      to: config.before,
    }));
  }, [config.after, config.before]);

  return (
    <IconStatisticsCard
      title="Main income source"
      color="success"
      className="card--hover-expand"
      isLoading={isLoading}
      content={model.data.name}
      icon={model.data.icon}
    />
  );
};

TopValueCategory.defaultProps = {
  config: DEFAULT_CONFIG,
  isLoading: false,
  updateStatisticsTrigger: false,
};

TopValueCategory.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    transactionType: PropTypes.oneOf([INCOME_TYPE, EXPENSE_TYPE]),
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

export default connect(mapStateToProps, { fetchStatistics })(TopValueCategory);
