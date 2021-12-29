import isEqual from 'lodash/isEqual';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Progress, Table } from 'reactstrap';

import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';

/** TODO: Style table as in daily expenses */
const NewExpenseCategoriesCard = ({ isLoading, model, onUpdate }) => {
  const { data } = model;

  return (
    data.length > 0 && (
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
            {data.map(({ icon, name, percentage }) => (
              <tr key={name}>
                <td>
                  <i className={icon} aria-hidden />
                </td>
                <td>{name}</td>
                <td>
                  <small className="d-block">
                    {percentage > 1 ? percentage.toFixed() : percentage.toFixed(1)}
                    %
                  </small>
                  <Progress striped value={percentage} color="danger" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TimeperiodStatisticsCard>
    )
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
