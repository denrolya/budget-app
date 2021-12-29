import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import {
  toggleArchived, updateName, updateColor,
} from 'src/store/actions/account';
import AccountSelector from 'src/components/AccountSelector';

const AccountList = ({ list }) => {
  const [selectedAccount, setSelectedAccount] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (list.length > 0) {
      setSelectedAccount(list[0].id);
    }
  }, [list.length]);

  useEffect(() => {
    if (selectedAccount) {
      navigate(`${selectedAccount}`);
    }
  }, [selectedAccount]);

  return (
    <>
      <Helmet>
        <title>
          Accounts | Budget
        </title>
      </Helmet>

      {list.length > 0 && <AccountSelector accounts={list} onChange={setSelectedAccount} selected={selectedAccount} />}

      <Outlet />
    </>
  );
};

AccountList.defaultProps = {};

AccountList.propTypes = {
  list: PropTypes.array.isRequired,
};

const mapStateToProps = ({ account }) => ({
  list: orderBy(account, ['archivedAt', 'lastTransactionAt'], ['desc', 'desc']),
});

export default connect(mapStateToProps, {
  toggleArchived,
  updateName,
  updateColor,
})(AccountList);
