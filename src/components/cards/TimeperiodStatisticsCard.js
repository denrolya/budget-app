import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import isString from 'lodash/isString';

import LoadingCard from 'src/components/cards/LoadingCard';

const TimeperiodStatisticsCard = ({
  isLoading,
  expandOnHover,
  transparent,
  header,
  children,
  className,
}) => (
  <LoadingCard
    body
    isLoading={isLoading}
    transparent={transparent}
    className={cn('pt-2', 'px-2', {
      'card--hover-expand': expandOnHover,
      [className]: className,
    })}
  >
    <header>
      {isString(header) && <h5 className="mb-3 text-white">{header}</h5>}
      {!isString(header) && header}
    </header>

    {children}
  </LoadingCard>
);

TimeperiodStatisticsCard.defaultProps = {
  className: '',
  expandOnHover: false,
  isLoading: false,
  transparent: false,
};

TimeperiodStatisticsCard.propTypes = {
  header: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  transparent: PropTypes.bool,
  expandOnHover: PropTypes.bool,
};

export default TimeperiodStatisticsCard;
