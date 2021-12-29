import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Progress, Table } from 'reactstrap';

import isEqual from 'lodash/isEqual';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';

const NewIncomeCategoriesCard = ({ isLoading, model, onUpdate }) => {
  const { data } = model;

  return (
    data.length > 0 && (
      <TimeperiodStatisticsCard
        title="New income categories"
        showControls={false}
        isLoading={isLoading}
        model={model}
        onUpdate={onUpdate}
      >
        <Table borderless size="sm">
          <tbody>
            {data.map(({ icon, name, percentage }) => (
              <tr key={name}>
                <td className="w-25px">
                  <i aria-hidden className={icon} />
                </td>
                <td>{name}</td>
                <td>
                  <small className="d-block">
                    {percentage > 1 ? percentage.toFixed() : percentage.toFixed(1)}
                    %
                  </small>
                  <Progress striped value={percentage} color="success" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TimeperiodStatisticsCard>
    )
  );
};

NewIncomeCategoriesCard.defaultProps = {
  isLoading: false,
};

NewIncomeCategoriesCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default memo(
  NewIncomeCategoriesCard,
  (prevProps, nextProps) => isEqual(prevProps.model.data, nextProps.model.data) && isEqual(prevProps.isLoading, nextProps.isLoading),
);
