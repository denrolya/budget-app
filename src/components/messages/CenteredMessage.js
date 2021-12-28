import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

const CenteredMessage = ({ title, message, className }) => (
  <div className={cn('d-flex', 'h-100', className)}>
    <h4 className="justify-content-center align-self-center mx-auto text-center">
      {title}
      {message && <small className="text-muted d-block">{message}</small>}
    </h4>
  </div>
);

CenteredMessage.defaultProps = {
  message: '',
  className: '',
};

CenteredMessage.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  className: PropTypes.string,
};

export default CenteredMessage;
