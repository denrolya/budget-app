import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

const AddNewButton = ({ onClick, text, size, color }) => (
  <Button className="btn-round btn-icon" size={size} color={color} onClick={onClick}>
    {text}
  </Button>
);

AddNewButton.defaultProps = {
  text: <i className="tim-icons icon-simple-add" />,
  size: 'md',
  color: 'primary',
};

AddNewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  size: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  color: PropTypes.string,
};

export default AddNewButton;
