import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  Carousel,
  CarouselIndicators,
  CarouselItem,
} from 'reactstrap';

import { randomString } from 'src/utils/randomData';

const CarouselWithSwipe = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [items, setItems] = useState([]);

  // key property is required by reactstrap.Carousel
  useEffect(() => {
    setItems(data.map((el) => ({
      key: randomString(5),
      item: el,
    })));
  }, [data]);

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
    <div {...swipeHandlers}>
      <Carousel touch activeIndex={activeIndex} next={next} previous={prev}>
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {items.map(({ key, item }) => (
          <CarouselItem
            {...swipeHandlers}
            key={`carousel-item-${key}`}
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
          >
            { item }
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
  /* eslint-enable react/jsx-props-no-spreading */
};

CarouselWithSwipe.defaultProps = {
  data: [],
};

CarouselWithSwipe.propTypes = {
  data: PropTypes.arrayOf(PropTypes.node),
};

export default CarouselWithSwipe;
