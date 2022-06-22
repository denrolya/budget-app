import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CardBody } from 'reactstrap';

import LoadingCard from 'src/components/cards/LoadingCard';

const Card = ({
  isLoading,
  title,
  content,
  footer,
  link,
  displayDateRange,
  footerPadding,
  ...rest
}) => {
  /* eslint-disable react/jsx-props-no-spreading */
  const component = (
    <LoadingCard
      isLoading={isLoading}
      className={cn('card-stats', 'card--hover-expand', 'card-stats-simple', 'p-0')}
      {...rest}
    >
      <CardBody className="p-0">
        <div className="pt-3 px-3">
          <span className="text-white">{title}</span>
          {displayDateRange && (
            <div className="pull-right">
              <span className="small">1 Dec - 31 Dec</span>
            </div>
          )}

          <div className="card-title h3 mb-1">{content}</div>
        </div>
        <div
          className={cn('mb-0', 'h5', 'text-white', {
            'px-3 pb-3': footerPadding,
          })}
        >
          {footer}
        </div>
      </CardBody>
    </LoadingCard>
  );
  /* eslint-enable react/jsx-props-no-spreading */

  if (link) {
    return <Link to={link}>{component}</Link>;
  }

  return component;
};

Card.defaultProps = {
  displayDateRange: false,
  footerPadding: true,
  isLoading: false,
};

Card.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]).isRequired,
  displayDateRange: PropTypes.bool,
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
  isLoading: PropTypes.bool,
  footerPadding: PropTypes.bool,
  link: PropTypes.string,
};

export default Card;
