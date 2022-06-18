import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Progress, Table } from 'reactstrap';
import isEqual from 'lodash/isEqual';

import { useExpenseCategories } from 'src/contexts/CategoriesContext';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { amountInPercentage } from 'src/utils/common';

/** TODO: Style table as in daily expenses */
const NewExpenseCategoriesCard = ({ isLoading, model, onUpdate }) => {
  const { from } = model;

  const expenseCategories = useExpenseCategories();
  const newCategories = useMemo(
    () => expenseCategories.filter(({ createdAt }) => createdAt.year() === from.year()),
    [expenseCategories, from.year()],
  );

  const data = useMemo(
    () => model.data.hasChildren()
      ? newCategories.map((c) => model.data.first(({ model: { name } }) => name === c.name).model)
      : [],
    [isLoading],
  );

  return (
    <TimeperiodStatisticsCard
      title="New expense categories"
      className="card--hover-expand"
      showControls={false}
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <Table borderless size="sm">
        <tbody>
          {data.map(({ name, icon, total }) => {
            const percentage = amountInPercentage(model.data.model.total, total);

            return (
              <tr key={name}>
                <td>
                  <i aria-hidden className={icon} />
                </td>
                <td>{name}</td>
                <td>
                  <small className="d-block font-style-numeric">
                    {percentage.toFixed(percentage > 1 ? 0 : 1)}
                    %
                  </small>
                  <Progress striped color="danger" value={percentage} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TimeperiodStatisticsCard>
  );
};

NewExpenseCategoriesCard.defaultProps = {
  isLoading: false,
};

NewExpenseCategoriesCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default memo(
  NewExpenseCategoriesCard,
  (prevProps, nextProps) => isEqual(prevProps.model.data, nextProps.model.data) && isEqual(prevProps.isLoading, nextProps.isLoading),
);
