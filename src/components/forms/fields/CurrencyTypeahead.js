import axios from 'src/services/http';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useMemo } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

import { randomInt } from 'src/services/common';
import Routing from 'src/services/routing';

const CurrencyTypeahead = ({
  id, className, name, autoFocus, onChange, value, multiple, ...rest
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios.get(Routing.generate('api_v1_currency_list')).then((res) => setOptions(res.data));
  }, []);

  const selected = useMemo(() => {
    const option = options.find(({ code }) => code === value);

    return option ? [option] : [];
  }, [options.length, value]);

  return (
    <Typeahead
      id={randomInt()}
      labelKey="name"
      allowNew={false}
      autoFocus={autoFocus}
      className={className}
      name={name}
      onChange={onChange}
      multiple={multiple}
      options={options}
      inputProps={{ id }}
      selected={selected}
      {...rest}
    />
  );
};

CurrencyTypeahead.defaultProps = {
  autoFocus: false,
  multiple: false,
  value: '',
  id: randomInt(),
  name: 'currency',
  className: '',
};

CurrencyTypeahead.propTypes = {
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  multiple: PropTypes.bool,
  name: PropTypes.string,
};

export default CurrencyTypeahead;
