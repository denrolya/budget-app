import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import LoadingCard from 'src/components/cards/LoadingCard';
import IncomeExpenseChart from 'src/components/charts/recharts/bar/IncomeExpense';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import { fetchStatistics } from 'src/store/actions/dashboard';
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
    const data = await fetchStatistics(CONFIG);
    console.log({ data });
    setModel(model.set('data', data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setModel(model.merge({
      from: INTERVALS[interval].value[0],
      to: INTERVALS[interval].value[1],
    }));
  }, [interval]);

  return (
    <LoadingCard transparent isLoading={isLoading}>
      {Object.keys(INTERVALS).map((name) => (
        <Button
          size="sm"
          color="danger"
          className="text-uppercase btn-simple"
          key={name}
          active={name === interval}
          onClick={() => setInterval(name)}
        >
          {name}
        </Button>
      ))}
      <IncomeExpenseChart data={model.data} interval={interval} onUpdate={setModel} />
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
