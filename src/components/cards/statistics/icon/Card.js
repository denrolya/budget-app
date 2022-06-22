import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  CardBody,
  CardFooter,
  Col,
  Row,
} from 'reactstrap';

import LoadingCard from 'src/components/cards/LoadingCard';

const Icon = ({ icon, color }) => (
  <div className={cn('info-icon', 'text-center', 'text-white', `icon-${color}`)}>
    <i aria-hidden className={icon} />
  </div>
);

Icon.propTypes = {
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

/* eslint-disable react/jsx-props-no-spreading */
const Card = ({
  isLoading,
  icon,
  to,
  color,
  title,
  content,
  children,
  className,
  ...rest
}) => (
  <LoadingCard
    className={cn('card-stats', 'card--hover-expand', {
      [className]: className,
    })}
    isLoading={isLoading}
    {...rest}
  >
    <CardBody
      className={cn('px-3', 'py-3', {
        'pb-1': !!children,
      })}
    >
      <Row>
        <Col xs={9}>
          <div className="numbers">
            <span className="text-white">{title}</span>
            <h3 className="card-title mb-0 font-weight-bold">{content}</h3>
          </div>
        </Col>
        <Col xs={3} className="d-flex justify-content-end">
          {icon && to && (
            <Link to={to}>
              <Icon icon={icon} color={color} />
            </Link>
          )}
          {icon && !to && <Icon icon={icon} color={color} />}
        </Col>
      </Row>
    </CardBody>
    <CardFooter>
      {children && (
        <>
          <hr />
          <div className="stats">{children}</div>
        </>
      )}
    </CardFooter>
  </LoadingCard>
);
/* eslint-enable react/jsx-props-no-spreading */

Card.defaultProps = {
  children: undefined,
  className: '',
  color: undefined,
  icon: undefined,
  isLoading: false,
  to: undefined,
};

Card.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]).isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  color: PropTypes.string,
  icon: PropTypes.string,
  isLoading: PropTypes.bool,
  to: PropTypes.string,
};

export default Card;
