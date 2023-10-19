import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

const AddNewButton = ({
  onClick, text, size, color,
}) => (
  <Button className="btn-round btn-icon" size={size} color={color} onClick={onClick}>
    {text}
  </Button>
);

AddNewButton.defaultProps = {
  color: 'primary',
  size: 'md',
  text: <i aria-hidden className="tim-icons icon-simple-add" />,
};

AddNewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  size: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  color: PropTypes.string,
};

export default AddNewButton;
