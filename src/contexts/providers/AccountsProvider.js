import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchList as fetchAccounts } from 'src/store/actions/account';

import AccountsContext from 'src/contexts/AccountsContext';

const AccountsProvider = ({ accounts, fetchAccounts, children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await fetchAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setData(
      orderBy(
        accounts,
        ['archivedAt', 'lastTransactionAt'],
        ['desc', 'desc'],
      ),
    );
  }, [accounts]);

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AccountsContext.Provider value={data}>
      { children }
    </AccountsContext.Provider>
  );
};

AccountsProvider.defaultProps = {
  accounts: [],
};

AccountsProvider.propTypes = {
  fetchAccounts: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  accounts: PropTypes.array,
};

const mapStateToProps = ({ account: { list: accounts } }) => ({ accounts });

export default connect(mapStateToProps, {
  fetchAccounts,
})(AccountsProvider);
