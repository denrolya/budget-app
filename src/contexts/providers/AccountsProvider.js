import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { isActionResolved } from 'src/utils/common';
import { fetchList as fetchAccounts } from 'src/store/actions/account';
import AccountsContext from 'src/contexts/AccountsContext';

const AccountsProvider = ({
  accounts, isExchangeRatesLoaded, fetchAccounts, children,
}) => {
  useEffect(() => {
    if (isExchangeRatesLoaded) {
      fetchAccounts();
    }
  }, [isExchangeRatesLoaded]);

  return (
    <AccountsContext.Provider value={accounts}>
      { children }
    </AccountsContext.Provider>
  );
};

AccountsProvider.defaultProps = {
  accounts: [],
  isExchangeRatesLoaded: false,
};

AccountsProvider.propTypes = {
  fetchAccounts: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  accounts: PropTypes.array,
  isExchangeRatesLoaded: PropTypes.bool,
};

const mapStateToProps = ({ account: { list: accounts }, ui }) => ({
  accounts,
  isExchangeRatesLoaded: isActionResolved(ui.EXCHANGE_RATES_FETCH),
});

export default connect(mapStateToProps, {
  fetchAccounts,
})(AccountsProvider);
