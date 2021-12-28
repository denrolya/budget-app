import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';
import cn from 'classnames';
import LoadingOverlay from 'react-loading-overlay';

const LoadingCard = ({ isLoading, transparent, className, children, ...rest }) => (
  <Card
    className={cn(className, {
      'card--transparent': transparent,
      'card--loading': isLoading,
    })}
    {...rest}
  >
    <LoadingOverlay spinner active={isLoading} className="h-100 overlay-rounded">
      {children}
    </LoadingOverlay>
  </Card>
);

LoadingCard.propTypes = {
  isLoading: false,
  transparent: false,
};

LoadingCard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  transparent: PropTypes.bool,
};

export default LoadingCard;
