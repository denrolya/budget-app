import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { FormGroup, Label, Input } from 'reactstrap';

const AccountSelector = ({ accounts, selected, onChange }) => (
  <FormGroup className="d-block">
    <Label for="accountSelect" className="d-none">
      Accounts
    </Label>
    <Input
      type="select"
      name="account"
      id="accountSelect"
      value={selected}
      onChange={({ target }) => onChange(target.value)}
    >
      {accounts.map(({ id, name, archivedAt }) => (
        <option key={`account-option-${id}`} value={id}>
          {name} {archivedAt ? `(Archived ${moment(archivedAt).calendar()})` : ''}
        </option>
      ))}
    </Input>
  </FormGroup>
);

AccountSelector.defaultProps = {
  accounts: [],
  selected: null,
};

AccountSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.number,
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      archivedAt: PropTypes.string,
    }),
  ),
};

export default AccountSelector;
