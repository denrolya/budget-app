import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import AccountSelector from 'src/components/AccountSelector';
import { useAccountsWithDefaultOrder } from 'src/contexts/AccountsContext';

const AccountList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const list = useAccountsWithDefaultOrder();

  useEffect(() => {
    if (list.length > 0 && !id) {
      navigate(`${list[0].id}`);
    }
  }, [list.length]);

  useEffect(() => {
    if (!id) {
      navigate(`${list[0].id}`);
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>
          Accounts | Budget
        </title>
      </Helmet>

      {list.length > 0 && <AccountSelector accounts={list} onChange={(v) => navigate(`${v}`)} selected={id || ''} />}

      { id && <Outlet /> }
    </>
  );
};

AccountList.defaultProps = {};

AccountList.propTypes = {};

export default AccountList;
