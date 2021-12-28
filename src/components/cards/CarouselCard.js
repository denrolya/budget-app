import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Carousel, CarouselItem, CarouselIndicators } from 'reactstrap';

import LoadingCard from 'src/components/cards/LoadingCard';

const CarouselCard = ({ isLoading, items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    setActiveIndex(newIndex);
  };

  return (
    <LoadingCard className="card-stats card-stats-carousel" isLoading={isLoading}>
      <Carousel ride="carousel" activeIndex={activeIndex} next={next} previous={previous}>
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {items.map((item) => (
          <CarouselItem key={Math.random()}>{item}</CarouselItem>
        ))}
      </Carousel>
    </LoadingCard>
  );
};

CarouselCard.defaultProps = {
  isLoading: false,
  items: [],
};

CarouselCard.propTypes = {
  isLoading: PropTypes.bool,
  items: PropTypes.array,
};

export default CarouselCard;
