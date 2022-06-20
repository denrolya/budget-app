import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AccountsContext from 'src/contexts/AccountsContext';

const AccountsProvider = ({ accounts, children }) => (
  <AccountsContext.Provider value={accounts}>
    { children }
  </AccountsContext.Provider>
);

AccountsProvider.defaultProps = {
  accounts: [],
};

AccountsProvider.propTypes = {
  children: PropTypes.any.isRequired,
  accounts: PropTypes.array,
};

const mapStateToProps = ({ account: { list: accounts } }) => ({
  accounts,
});

export default connect(mapStateToProps)(AccountsProvider);
