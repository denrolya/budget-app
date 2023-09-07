import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import IconStatisticsCard from 'src/components/cards/statistics/icon/Card';
import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import { PATHS } from 'src/constants/statistics';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { fetchStatistics } from 'src/store/actions/statistics';
import { amountInPercentage, isActionLoading } from 'src/utils/common';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: PATHS.valueByPeriod,
  after: moment().startOf('month'),
  before: moment().endOf('month'),
  interval: null,
};

const PercentageSpentFromIncomeCard = ({
  isLoading,
  updateStatisticsTrigger,
  fetchStatistics,
  config,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const [model, setModel] = useState(new TimeperiodIntervalStatistics({
    data: 0,
    interval: config.interval,
    from: moment.isMoment(config.after) ? config.after : moment(config.after),
    to: moment.isMoment(config.before) ? config.before : moment(config.before),
  }));

  useEffect(() => {
    setModel(model.merge({
      from: config.after,
      to: config.before,
      interval: config.interval,
    }));
  }, [config.after, config.before]);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
        before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        interval: model.interval,
      };
      const data = await fetchStatistics({ ...config, params });
      setModel(model.set('data', amountInPercentage(data[0].income, data[0].expense, 0)));
    };

    fetchData();
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), model.interval, updateStatisticsTrigger]);

  let icon = 'ion-ios-volume-low';
  let color = 'info';

  if (model.data < 10) {
    icon = 'ion-ios-volume-off';
    color = 'info';
  } else if (model.data >= 10 && model.data < 20) {
    icon = 'ion-ios-volume-mute';
    color = 'success';
  } else if (model.data >= 20 && model.data < 30) {
    icon = 'ion-ios-volume-low';
    color = 'warning';
  } else if (model.data >= 30) {
    icon = 'ion-ios-volume-high';
    color = 'danger';
  }

  return (
    <IconStatisticsCard
      title="Spent from income"
      content={(
        <span className="font-style-numeric">
          {`% ${model.data}`}
        </span>
      )}
      isLoading={isLoading}
      icon={icon}
      color={color}
    />
  );
};

PercentageSpentFromIncomeCard.defaultProps = {
  config: DEFAULT_CONFIG,
  isLoading: false,
  updateStatisticsTrigger: false,
};

PercentageSpentFromIncomeCard.propTypes = {
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
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ ui }, { config }) => ({
  isLoading: isActionLoading(ui[`STATISTICS_FETCH_${upperCase(snakeCase(config.name))}`]),
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(PercentageSpentFromIncomeCard);
