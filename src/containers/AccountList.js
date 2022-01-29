import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { updateName, updateColor } from 'src/store/actions/account';
import AccountSelector from 'src/components/AccountSelector';

const AccountList = ({ list }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (list.length > 0) {
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

      {list.length > 0 && <AccountSelector accounts={list} onChange={(v) => navigate(`${v}`)} selected={id} />}

      { id && <Outlet /> }
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
  updateName,
  updateColor,
})(AccountList);
