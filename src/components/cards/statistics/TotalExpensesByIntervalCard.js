import isEqual from 'lodash/isEqual';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import ExpensesBySeason from 'src/components/charts/recharts/pie/ExpensesBySeason';

const TotalExpensesByIntervalCard = ({
  isLoading, model, onUpdate, className, transparent,
}) => (
  <TimeperiodStatisticsCard
    className={cn('card-chart', 'card--hover-expand', className)}
    title="Expenses by seasons"
    showControls={false}
    transparent={transparent}
    isLoading={isLoading}
    model={model}
    onUpdate={onUpdate}
  >
    <ExpensesBySeason data={model.data} />
  </TimeperiodStatisticsCard>
);

TotalExpensesByIntervalCard.defaultProps = {
  className: '',
  isLoading: false,
  transparent: false,
};

TotalExpensesByIntervalCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodIntervalStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  transparent: PropTypes.bool,
};

export default memo(
  TotalExpensesByIntervalCard,
  (pp, np) => isEqual(pp.model.data, np.model.data) && isEqual(pp.isLoading, np.isLoading),
);
