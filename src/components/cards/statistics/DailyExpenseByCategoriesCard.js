import React, { memo } from 'react';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import find from 'lodash/find';
import cn from 'classnames';
import { CardTitle, Table } from 'reactstrap';
import PropTypes from 'prop-types';

import MoneyValue from 'src/components/MoneyValue';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { amountInPercentage, arrowIcon, textColor } from 'src/services/common';

/** TODO: Adjust trend icon & color; Compare to same data last year(in colors, maybe...) */
const DailyExpenseByCategoriesCard = ({ isLoading, model, onUpdate }) => {
  const { data } = model;
  const dailyExpense = sumBy(data.selected, 'value');
  const dailyExpensePreviousPeriod = sumBy(data.previous, 'value');
  const percentage = amountInPercentage(dailyExpensePreviousPeriod, dailyExpense);

  return (
    <TimeperiodStatisticsCard
      className="card-stats"
      title="Daily expenses"
      showControls={false}
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <CardTitle tag="h3">
        <i className="ion-ios-calendar text-primary" aria-hidden />
        {' '}
        <MoneyValue amount={dailyExpense} />
      </CardTitle>

      <Table borderless size="sm">
        <tbody>
          {data.selected
            .sort((a, b) => b.value - a.value)
            .map(({ icon, name, value }) => {
              const percentage = amountInPercentage(
                find(data.previous, (category) => category.name === name),
                value,
              );
              return (
                <tr key={name}>
                  <td>
                    <i className={icon} aria-hidden />
                  </td>
                  <td>{name}</td>
                  <td className="text-right font-weight-bold">
                    <i className={cn('mr-1', arrowIcon(percentage), textColor(percentage))} aria-hidden />
                    <MoneyValue amount={value} />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <hr className="m-0" />
      <div className="stats mx-0">
        <p className={cn('text-right', textColor(percentage))}>
          <i className={cn('mr-1', arrowIcon(percentage))} aria-hidden />
          <MoneyValue maximumFractionDigits={0} amount={Math.abs(dailyExpense - dailyExpensePreviousPeriod)} />
        </p>
      </div>
    </TimeperiodStatisticsCard>
  );
};

DailyExpenseByCategoriesCard.defaultProps = {
  isLoading: false,
};

DailyExpenseByCategoriesCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default memo(
  DailyExpenseByCategoriesCard,
  (pp, np) => isEqual(pp.model.data, np.model.data) && isEqual(pp.isLoading, np.isLoading),
);
