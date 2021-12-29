import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  Carousel, CarouselIndicators, CarouselItem, Row, Col,
} from 'reactstrap';

import SimpleStatisticsCard from 'src/components/cards/statistics/SimpleStatisticsCard';
import MoneyValue from 'src/components/MoneyValue';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { generateLinkToExpenses } from 'src/services/routing';
import PercentageSinceLastMonthMessage from 'src/components/messages/PercentageSinceLastMonthMessage';
import AmountSinceLastPeriodMessage from 'src/components/messages/AmountSinceLastPeriodMessage';

const ShortStatistics = ({ isLoading, model, onUpdate }) => {
  const {
    data: { current, previous },
  } = model;
  const [activeIndex, setActiveIndex] = useState(2);
  const [animating, setAnimating] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([
      {
        key: 0,
        // eslint-disable-next-line react/no-unstable-nested-components
        Item: () => (
          <SimpleStatisticsCard
            isLoading={isLoading}
            link={generateLinkToExpenses(model.from.format(MOMENT_DATE_FORMAT), model.to.format(MOMENT_DATE_FORMAT))}
            title={`Expenses in ${model.from.format('MMMM')}`}
            content={<MoneyValue className="font-weight-bold" amount={current.total} maximumFractionDigits={0} />}
            footer={<PercentageSinceLastMonthMessage previous={previous.total} current={current.total} />}
          />
        ),
      },
      {
        key: 1,
        // eslint-disable-next-line react/no-unstable-nested-components
        Item: () => (
          <SimpleStatisticsCard
            title="Food expenses"
            content={<MoneyValue className="font-weight-bold" amount={current.food} maximumFractionDigits={0} />}
            footer={<PercentageSinceLastMonthMessage previous={previous.food} current={current.food} />}
            link={generateLinkToExpenses(
              model.from.format(MOMENT_DATE_FORMAT),
              model.to.format(MOMENT_DATE_FORMAT),
              null,
              ['Food & Drinks'],
            )}
            isLoading={isLoading}
          />
        ),
      },
      {
        key: 2,
        // eslint-disable-next-line react/no-unstable-nested-components
        Item: () => (
          <SimpleStatisticsCard
            title="Rent & Utilities"
            isLoading={isLoading}
            link={generateLinkToExpenses(
              model.from.format(MOMENT_DATE_FORMAT),
              model.to.format(MOMENT_DATE_FORMAT),
              null,
              ['Rent', 'Utilities'],
            )}
            content={<MoneyValue className="font-weight-bold" amount={current.rent} maximumFractionDigits={0} />}
            footer={<AmountSinceLastPeriodMessage current={current.rent} previous={previous.rent} />}
          />
        ),
      },
      {
        key: 3,
        // eslint-disable-next-line react/no-unstable-nested-components
        Item: () => (
          <SimpleStatisticsCard
            title="Daily expenses"
            isLoading={isLoading}
            content={<MoneyValue className="font-weight-bold" amount={current.daily} maximumFractionDigits={0} />}
            footer={<PercentageSinceLastMonthMessage previous={previous.daily} current={current.daily} />}
          />
        ),
      },
    ]);
  }, [previous.total]);

  const next = () => {
    if (animating) {
      return;
    }
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const prev = () => {
    if (animating) {
      return;
    }
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) {
      return;
    }
    setActiveIndex(newIndex);
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => prev(),
    onSwipedLeft: () => next(),
    delta: 10,
    preventDefaultTouchmoveEvent: false,
  });

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <TimeperiodStatisticsCard
      transparent
      className="mb-0"
      bodyClassName="py-0"
      showControls={false}
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <Row>
        <Col xs={12} className="d-md-none">
          <div {...swipeHandlers}>
            <Carousel touch activeIndex={activeIndex} next={next} previous={prev}>
              <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
              {items.map(({ key, Item }) => (
                <CarouselItem
                  {...swipeHandlers}
                  key={`carousel-item-${key}`}
                  onExiting={() => setAnimating(true)}
                  onExited={() => setAnimating(false)}
                >
                  <Item />
                </CarouselItem>
              ))}
            </Carousel>
          </div>
        </Col>

        {items.map(({ key, Item }) => (
          <Col key={key} md={6} lg={3} className="d-none d-md-block">
            <Item />
          </Col>
        ))}
      </Row>
    </TimeperiodStatisticsCard>
  );
  /* eslint-enable react/jsx-props-no-spreading */
};

ShortStatistics.defaultProps = {
  isLoading: false,
};

ShortStatistics.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ShortStatistics;
