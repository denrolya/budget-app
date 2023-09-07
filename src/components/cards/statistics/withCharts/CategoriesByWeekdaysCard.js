import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import { API } from 'src/constants/api';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import ExpenseCategoriesByWeekdays from 'src/components/charts/recharts/bar/ExpenseCategoriesByWeekdays';
import { randomFloat } from 'src/utils/randomData';
import { fetchStatistics } from 'src/store/actions/statistics';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  transactionType: EXPENSE_TYPE,
  path: API.transactionsValueByWeekdays,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
};

const CategoryExpensesByWeekdaysCard = ({
  updateStatisticsTrigger, fetchStatistics, config,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(new TimeperiodStatistics({
    from: config.after,
    to: config.before,
    data: [1, 2, 3, 4, 5, 6, 7].map((day) => ({
      name: moment().isoWeekday(day).format('dddd'),
      values: Object.fromEntries(
        [
          'Food & Drinks',
          'Housing',
          'Work Expense',
          'Unknown',
          'Transportation',
          'Other',
          'Shopping',
          'Health & Fitness',
          'Vehicle',
          'Financial expenses',
        ].map((cat) => [cat, randomFloat(0, 300)]),
      ),
    })),
  }));
  const [isFilteredDataSelected, setIsFilteredDataSelected] = useState(false);

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
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), updateStatisticsTrigger]);

  return (
    <TimeperiodStatisticsCard
      header="Days in week expenses"
      className="card-chart"
      isLoading={isLoading}
    >
      <ExpenseCategoriesByWeekdays topCategories={isFilteredDataSelected} data={model.data} />

      <Button
        block
        color="danger"
        size="sm"
        className="btn-simple"
        active={isFilteredDataSelected}
        onClick={() => setIsFilteredDataSelected(!isFilteredDataSelected)}
      >
        Show only top categories
      </Button>
    </TimeperiodStatisticsCard>
  );
};

CategoryExpensesByWeekdaysCard.defaultProps = {
  config: DEFAULT_CONFIG,
  updateStatisticsTrigger: false,
};

CategoryExpensesByWeekdaysCard.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = ({ ui }) => ({
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(CategoryExpensesByWeekdaysCard);
