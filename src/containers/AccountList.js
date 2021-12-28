import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, CardBody } from 'reactstrap';

import LoadingCard from 'src/components/cards/LoadingCard';
import { confirmAccountArchivation, confirmAccountNameChange, confirmAccountRestoration } from 'src/services/common';
import { toggleArchived, fetchDetail, updateName, updateColor } from 'src/store/actions/account';
import AccountDetails from 'src/components/AccountDetails';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { formatDetails } from 'src/services/account';
import AccountSelector from 'src/components/AccountSelector';
import AccountTransactionsDetails from 'src/components/AccountTransactionsDetails';

const AccountList = ({ list, exchangeRates, updateName, updateColor, toggleArchived }) => {
  const { code } = useBaseCurrency();
  const [selectedAccount, setSelectedAccount] = useState();
  const [accountDetails, setAccountDetails] = useState();
  const [isAccountDetailsLoading, setIsAccountDetailsLoading] = useState(false);

  const fetchAccountDetails = async (id) => {
    setIsAccountDetailsLoading(true);
    const { data } = await fetchDetail(id);
    setAccountDetails(formatDetails(data, code));
    setIsAccountDetailsLoading(false);
  };

  useEffect(() => {
    if (list.length > 0) {
      setSelectedAccount(list[0].id);
    }
  }, [list.length]);

  useEffect(() => {
    if (selectedAccount) {
      fetchAccountDetails(selectedAccount);
    } else {
      setAccountDetails();
    }
  }, [selectedAccount]);

  const onArchiveClick = (account) =>
    confirmAccountArchivation(account).then(async ({ value }) => {
      if (value) {
        await toggleArchived(account.id);
        await fetchAccountDetails(account.id);
      }
    });

  const onRestoreClick = (account) =>
    confirmAccountRestoration(account).then(async ({ value }) => {
      if (value) {
        await toggleArchived(account.id);
        await fetchAccountDetails(account.id);
      }
    });

  const onNameChange = (account, newName) =>
    confirmAccountNameChange(account, newName).then(async ({ value }) => {
      if (value) {
        await updateName(account, newName);
        await fetchAccountDetails(account.id);
      }
    });

  const onColorChange = async (account, newColor) => {
    await updateColor(account, newColor);
    await fetchAccountDetails(account.id);
  };

  return (
    <>
      {list.length > 0 && <AccountSelector accounts={list} onChange={setSelectedAccount} selected={selectedAccount} />}

      <Row>
        <Col xs={12}>
          <h4 className="mb-2">Details</h4>
          <LoadingCard isLoading={isAccountDetailsLoading}>
            <CardBody>
              {accountDetails && (
                <AccountDetails
                  data={accountDetails}
                  exchangeRates={exchangeRates}
                  onNameChange={onNameChange}
                  onColorChange={onColorChange}
                  onArchive={onArchiveClick}
                  onRestore={onRestoreClick}
                />
              )}
            </CardBody>
          </LoadingCard>
        </Col>
        <Col xs={12} md={8}>
          <h4 className="mb-2">Transactions</h4>
          <LoadingCard isLoading={isAccountDetailsLoading}>
            <CardBody>{accountDetails && <AccountTransactionsDetails account={accountDetails.account} />}</CardBody>
          </LoadingCard>
        </Col>
      </Row>
    </>
  );
};

AccountList.defaultProps = {};

AccountList.propTypes = {
  toggleArchived: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  updateColor: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  exchangeRates: PropTypes.object.isRequired,
};

const mapStateToProps = ({ account, exchangeRates }) => ({
  exchangeRates,
  list: orderBy(account, ['archivedAt', 'lastTransactionAt'], ['desc', 'desc']),
});

export default connect(mapStateToProps, {
  toggleArchived,
  updateName,
  updateColor,
})(AccountList);
