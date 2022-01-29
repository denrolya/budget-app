import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  Carousel, CarouselIndicators, CarouselItem, Row, Col,
} from 'reactstrap';

const CardsSet = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [animating, setAnimating] = useState(false);

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
    <Row>
      <Col xs={12} className="d-md-none">
        <div {...swipeHandlers}>
          <Carousel touch activeIndex={activeIndex} next={next} previous={prev}>
            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {items.map(({ key, item: Item }) => (
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

      {items.map(({ key, item: Item }) => (
        <Col key={key} md={6} lg={3} className="d-none d-md-block">
          <Item />
        </Col>
      ))}
    </Row>
  );
  /* eslint-enable react/jsx-props-no-spreading */
};

CardsSet.defaultProps = {
  items: [],
};

CardsSet.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    item: PropTypes.any.isRequired,
  })),
};

export default CardsSet;
