import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import { randomMoneyFlowData } from 'src/utils/randomData';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { API } from 'src/constants/api';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import SumBySeason from 'src/components/charts/recharts/pie/SumBySeason';
import { fetchStatistics } from 'src/store/actions/statistics';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  transactionType: EXPENSE_TYPE,
  path: API.valueByPeriod,
  after: moment().startOf('month'),
  before: moment().endOf('month'),
  accounts: [],
  categories: [],
  interval: '1 month',
};

const TotalExpensesByInterval = ({
  updateStatisticsTrigger,
  fetchStatistics,
  config,
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
    data: randomMoneyFlowData(),
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
      interval: config.interval,
    }));
  }, [config.after, config.before, config.interval]);

  return (
    <TimeperiodStatisticsCard
      className="card-chart"
      header="Expenses by seasons"
      isLoading={isLoading}
    >
      <SumBySeason data={model.data} type={config.transactionType} />
    </TimeperiodStatisticsCard>
  );
};

TotalExpensesByInterval.defaultProps = {
  config: DEFAULT_CONFIG,
  updateStatisticsTrigger: false,
};

TotalExpensesByInterval.propTypes = {
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

export default connect(mapStateToProps, { fetchStatistics })(TotalExpensesByInterval);
