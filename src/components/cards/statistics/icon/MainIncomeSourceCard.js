import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconStatisticsCard from 'src/components/cards/statistics/icon/Card';
import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import { API } from 'src/constants/api';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { fetchStatistics } from 'src/store/actions/statistics';

const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: API.topValueCategory,
  transactionType: INCOME_TYPE,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
};

const TopValueCategory = ({
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
    data: {
      icon: 'ion-ios-download',
      name: 'Salary',
      value: 5000,
    },
  }));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const params = {
        after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
        before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        type: config.transactionType,
      };
      const data = await fetchStatistics({ ...config, params });
      setModel(model.set('data', data));
      setIsLoading(false);
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
      isLoading={isLoading}
      content={model.data.name}
      icon={model.data.icon}
    />
  );
};

TopValueCategory.defaultProps = {
  config: DEFAULT_CONFIG,
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
};

const mapStateToProps = ({ ui }) => ({
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(TopValueCategory);
