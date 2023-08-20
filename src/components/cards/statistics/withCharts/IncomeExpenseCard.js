import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ButtonGroup } from 'reactstrap';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import { EXPENSE_TYPE } from 'src/constants/transactions';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { PATHS } from 'src/constants/statistics';
import LoadingCard from 'src/components/cards/LoadingCard';
import IncomeExpenseChart from 'src/components/charts/recharts/bar/IncomeExpense';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import { fetchStatistics } from 'src/store/actions/statistics';
import { isActionLoading } from 'src/utils/common';
import { INTERVALS } from 'src/constants/dashboard';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  transactionType: EXPENSE_TYPE,
  path: PATHS.incomeExpense,
};

const IncomeExpenseCard = ({ uiState, fetchStatistics, config }) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const isLoading = isActionLoading(uiState[`STATISTICS_FETCH_${upperCase(snakeCase(config.name))}`]);
  const [model, setModel] = useState(new TimeperiodStatistics({
    data: [],
    from: moment().subtract(6, 'month'),
    to: moment(),
  }));
  const [interval, setInterval] = useState('6m');

  const toggleInterval = (interval) => {
    setInterval(interval);
    setModel(model.merge({
      from: INTERVALS[interval].value[0],
      to: INTERVALS[interval].value[1],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        'executedAt[after]': model.from.format(MOMENT_DATETIME_FORMAT),
        'executedAt[before]': model.to.format(MOMENT_DATETIME_FORMAT),
      };
      const data = await fetchStatistics({ ...config, params });
      setModel(model.set('data', data));
    };

    fetchData();
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), uiState.updateStatisticsTrigger]);

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
  config: DEFAULT_CONFIG,
};

IncomeExpenseCard.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  uiState: PropTypes.object.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
  }),
};

const mapStateToProps = ({ ui }) => ({ uiState: ui });

export default connect(mapStateToProps, { fetchStatistics })(IncomeExpenseCard);
