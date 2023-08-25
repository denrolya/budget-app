import moment from 'moment-timezone';
import { connect } from 'react-redux';
import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { ACCOUNT_TYPE_CASH } from 'src/constants/account';
import { PATHS } from 'src/constants/statistics';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import AccountsExpenseDistribution from 'src/components/charts/recharts/pie/AccountsExpenseDistribution';
import { fetchStatistics } from 'src/store/actions/statistics';
import { isActionLoading } from 'src/utils/common';
import { randomColor, randomFloat } from 'src/utils/randomData';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: PATHS.accountDistribution,
  transactionType: EXPENSE_TYPE,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
};

const AccountDistributionCard = ({
  config,
  updateStatisticsTrigger,
  isLoading,
  transparent,
  height,
  fetchStatistics,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [model, setModel] = useState(new TimeperiodStatistics({
    from: config.after,
    to: config.before,
    data: [
      {
        account: {
          id: 1,
          name: 'Cash (₴)',
          symbol: '₴',
          type: ACCOUNT_TYPE_CASH,
          currency: 'UAH',
          color: randomColor(),
        },
        value: randomFloat(),
        amount: randomFloat(),
      },
      {
        account: {
          id: 2,
          name: 'Cash ($)',
          symbol: '$',
          type: ACCOUNT_TYPE_CASH,
          currency: 'USD',
          color: randomColor(),
        },
        value: randomFloat(),
        amount: randomFloat(),
      },
    ],
  }));

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStatistics({
        ...config,
        params: {
          type: config.transactionType,
          after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
          before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        },
      });

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

  const data = useMemo(() => sortBy(model.data, 'value'), [model.data.length]);

  return (
    <TimeperiodStatisticsCard
      className="card-chart card--hover-expand"
      header="Account distribution"
      transparent={transparent}
      isLoading={isLoading}
    >
      <AccountsExpenseDistribution data={data} height={height} />
    </TimeperiodStatisticsCard>
  );
};

AccountDistributionCard.defaultProps = {
  config: DEFAULT_CONFIG,
  height: 300,
  isLoading: false,
  transparent: false,
  updateStatisticsTrigger: false,
};

AccountDistributionCard.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    transactionType: PropTypes.oneOfType(EXPENSE_TYPE, INCOME_TYPE),
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  transparent: PropTypes.bool,
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ ui }, { config }) => ({
  isLoading: isActionLoading(ui[`STATISTICS_FETCH_${upperCase(snakeCase(config.name))}`]),
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(AccountDistributionCard);
