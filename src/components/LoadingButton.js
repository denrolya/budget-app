import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

/* eslint-disable react/jsx-props-no-spreading */
const LoadingButton = ({
  isLoading, label, type, className, color, ...rest
}) => (
  <Button className={className} color={color} type={type} disabled={isLoading} {...rest}>
    {isLoading && <i aria-hidden className="tim-icons icon-refresh-02 fa-spin" />}
    {!isLoading && label}
  </Button>
);
/* eslint-enable react/jsx-props-no-spreading */

LoadingButton.defaultProps = {
  className: '',
  color: 'primary',
  label: 'Submit',
  type: 'submit',
};

LoadingButton.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
};

export default LoadingButton;
