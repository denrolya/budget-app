import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Progress, Table } from 'reactstrap';
import isEqual from 'lodash/isEqual';
import MoneyValue from 'src/components/MoneyValue';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';

import { useCategories, useExpenseCategories, useIncomeCategories } from 'src/contexts/CategoriesContext';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { amountInPercentage } from 'src/utils/common';

/** TODO: Style table as in daily expenses */
const NewCategoriesCard = ({
  isLoading,
  model,
  onUpdate,
  type,
}) => {
  const { from } = model;

  const categories = useCategories();

  const newCategories = useMemo(
    () => categories.filter(({ type: catType, createdAt }) => catType === type && createdAt.year() === from.year()),
    [type, categories, from.year()],
  );

  const data = useMemo(
    () => model.data.hasChildren()
      ? newCategories.map((c) => model.data.first(({ model: { name } }) => name === c.name).model)
      : [],
    [isLoading],
  );

  if (data.length === 0) {
    return null;
  }

  return (
    <TimeperiodStatisticsCard
      title={`New ${type} categories`}
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
                <td>
                  {name}
                  {': '}
                  <MoneyValue bold amount={total} maximumFractionDigits={total > 1 ? 0 : 2} />
                </td>
                <td>
                  <small className="d-block font-style-numeric">
                    {percentage === 0 && '0'}
                    {percentage !== 0 && percentage.toFixed(percentage > 1 ? 0 : 1)}
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

NewCategoriesCard.defaultProps = {
  isLoading: false,
};

NewCategoriesCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  type: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]).isRequired,
};

export default memo(
  NewCategoriesCard,
  (prevProps, nextProps) => isEqual(prevProps.model.data, nextProps.model.data) && isEqual(prevProps.isLoading, nextProps.isLoading),
);
