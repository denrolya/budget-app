import isEqual from 'lodash/isEqual';
import sum from 'lodash/sum';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';

import MoneyValue from 'src/components/MoneyValue';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import CarouselCard from 'src/components/cards/CarouselCard';
import UtilityCosts from 'src/components/charts/recharts/area/UtilityCosts';
import SimpleStatisticsCard from 'src/components/cards/statistics/SimpleStatisticsCard';

/** TODO: Point radius 0; toFixed in tooltips */
const UtilityCostsByIntervalCard = ({
  displayMode, isLoading, model,
}) => {
  const items = model.data.map(({
    name, icon, color, values,
  }) => {
    const total = sum(values);

    return (
      <SimpleStatisticsCard
        footerPadding={false}
        key={name}
        title={name}
        isLoading={isLoading}
        content={(
          <>
            <i className={icon} style={{ color }} aria-hidden />
            {' '}
            <MoneyValue amount={total} maximumFractionDigits={0} />
          </>
        )}
        footer={<UtilityCosts name={name} data={values} color={color} />}
      />
    );
  });

  return (
    <>
      {displayMode === 'carousel' && <CarouselCard items={items} />}
      {displayMode === 'cols' && (
        <Row>
          {items.map((el) => (
            <Col key={el.key} xs={12} md={3}>
              {el}
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

UtilityCostsByIntervalCard.defaultProps = {
  displayMode: 'cols',
  isLoading: false,
};

UtilityCostsByIntervalCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodIntervalStatistics).isRequired,
  displayMode: PropTypes.oneOf(['carousel', 'cols']),
  isLoading: PropTypes.bool,
};

export default memo(
  UtilityCostsByIntervalCard,
  (prevProps, nextProps) => isEqual(prevProps.model.data, nextProps.model.data) && isEqual(prevProps.isLoading, nextProps.isLoading),
);
