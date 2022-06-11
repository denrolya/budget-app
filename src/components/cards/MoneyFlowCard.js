import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import PropTypes from 'prop-types';
import React, { memo } from 'react';

import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import MoneyValue from 'src/components/MoneyValue';
import MoneyFlowChart from 'src/components/charts/recharts/bar/MoneyFlowByInterval';

const MoneyFlowCard = ({ isLoading, model, onUpdate }) => {
  const { symbol } = useBaseCurrency();
  const { data, interval } = model;
  const totalExpense = Math.abs(sumBy(data, 'expense'));
  const totalRevenue = sumBy(data, 'income');

  return (
    <TimeperiodStatisticsCard
      transparent
      showControls
      className="card-chart card-chart-170"
      bodyClassName="p-0"
      title={<span className="d-none d-md-block">Money flow</span>}
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <div className="d-none d-md-flex justify-content-between px-2">
        <span className="text-nowrap text-success">
          <sup>{symbol}</sup>
          {' '}
          <span className="h2">
            <MoneyValue maximumFractionDigits={0} showSymbol={false} amount={totalRevenue} />
          </span>
        </span>

        <div className="text-nowrap text-right text-danger">
          <sup>{symbol}</sup>
          {' '}
          <span className="h2">
            <MoneyValue maximumFractionDigits={0} showSymbol={false} amount={totalExpense} />
          </span>
        </div>
      </div>
      <MoneyFlowChart data={data} interval={interval} />
    </TimeperiodStatisticsCard>
  );
};

MoneyFlowCard.defaultProps = {
  isLoading: false,
};

MoneyFlowCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodIntervalStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default memo(
  MoneyFlowCard,
  (pp, np) => isEqual(pp.model.data, np.model.data)
    && pp.isLoading === np.isLoading
    && pp.model.from.isSame(np.model.from)
    && pp.model.to.isSame(np.model.to)
    && pp.model.interval === np.model.interval,
);
