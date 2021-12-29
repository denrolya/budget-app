import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

import { randomInt } from 'src/services/common';
import { fetchTypeaheadList as fetchAccountsTypeahead } from 'src/store/actions/account';

const AccountTypeahead = ({
  autoFocus, onChange, multiple, placeholder, allowNew, selected, ref,
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchAccountsTypeahead().then((accounts) => setOptions(accounts));
  }, []);

  return (
    <Typeahead
      id={randomInt()}
      ref={ref}
      autoFocus={autoFocus}
      labelKey="name"
      allowNew={allowNew}
      onChange={onChange}
      multiple={multiple}
      options={options}
      selected={selected}
      placeholder={placeholder}
    />
  );
};

AccountTypeahead.propTypes = {
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  allowNew: PropTypes.bool,
  selected: PropTypes.array,
  ref: PropTypes.func,
};

export default AccountTypeahead;
