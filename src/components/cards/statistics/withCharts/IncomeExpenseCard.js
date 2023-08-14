import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ButtonGroup } from 'reactstrap';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import LoadingCard from 'src/components/cards/LoadingCard';
import IncomeExpenseChart from 'src/components/charts/recharts/bar/IncomeExpense';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import { fetchStatisticsIndependently as fetchStatistics } from 'src/store/actions/dashboard';
import { isActionLoading } from 'src/utils/common';
import { INTERVALS } from 'src/constants/dashboard';

const NAME = 'incomeExpense';
const CONFIG = {
  name: 'incomeExpense',
  path: 'api/transactions/statistics/income-expense',
};

const IncomeExpenseCard = ({ isLoading, fetchStatistics }) => {
  const [model, setModel] = useState(new TimeperiodStatistics({
    data: [],
    from: moment().subtract(6, 'month'),
    to: moment(),
  }));
  const [interval, setInterval] = useState('6m');

  const fetchData = async () => {
    const data = await fetchStatistics({ ...CONFIG, model });
    setModel(model.set('data', data));
  };

  const toggleInterval = (interval) => {
    setInterval(interval);
    setModel(model.merge({
      from: INTERVALS[interval].value[0],
      to: INTERVALS[interval].value[1],
    }));
  };

  useEffect(() => {
    fetchData();
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT)]);

  return (
    <LoadingCard transparent isLoading={isLoading}>
      <ButtonGroup size="sm">
        {Object.keys(INTERVALS).map((name) => (
          <Button
            size="sm"
            color="danger"
            className="text-uppercase btn-simple"
            key={name}
            active={name === interval}
            onClick={() => toggleInterval(name)}
          >
            {name}
          </Button>
        ))}
      </ButtonGroup>

      <IncomeExpenseChart data={model.data} interval={interval} />
    </LoadingCard>
  );
};

IncomeExpenseCard.defaultProps = {
  isLoading: false,
};

IncomeExpenseCard.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ ui }) => ({
  isLoading: isActionLoading(ui[`DASHBOARD_FETCH_STATISTICS_${upperCase(snakeCase(NAME))}`]),
});

export default connect(mapStateToProps, { fetchStatistics })(IncomeExpenseCard);
