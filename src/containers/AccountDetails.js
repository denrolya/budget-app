import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row, Col, CardBody } from 'reactstrap';

import LoadingCard from 'src/components/cards/LoadingCard';
import { confirmAccountArchivation, confirmAccountNameChange, confirmAccountRestoration } from 'src/services/common';
import {
  toggleArchived, fetchDetail, updateName, updateColor,
} from 'src/store/actions/account';
import AccountGeneralInfo from 'src/components/AccountGeneralInfo';
import { formatDetails } from 'src/services/account';
import AccountTransactionsDetails from 'src/components/AccountTransactionsDetails';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const AccountDetails = ({
  exchangeRates, updateName, updateColor, toggleArchived,
}) => {
  const { id = null } = useParams();
  const { code } = useBaseCurrency();
  const [accountDetails, setAccountDetails] = useState();
  const [isAccountDetailsLoading, setIsAccountDetailsLoading] = useState(false);

  const fetchAccountDetails = async (id) => {
    setIsAccountDetailsLoading(true);
    const { data } = await fetchDetail(id);
    setAccountDetails(formatDetails(data, code));
    setIsAccountDetailsLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchAccountDetails(id);
    } else {
      setAccountDetails();
    }
  }, [id]);

  const onArchiveClick = (account) => confirmAccountArchivation(account).then(async ({ value }) => {
    if (value) {
      await toggleArchived(account.id);
      await fetchAccountDetails(account.id);
    }
  });

  const onRestoreClick = (account) => confirmAccountRestoration(account).then(async ({ value }) => {
    if (value) {
      await toggleArchived(account.id);
      await fetchAccountDetails(account.id);
    }
  });

  const onNameChange = (account, newName) => confirmAccountNameChange(account, newName).then(async ({ value }) => {
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
      <Helmet>
        <title>
          {accountDetails?.name ? accountDetails?.name : 'Accounts'}
          {' '}
          | Budget
        </title>
      </Helmet>

      <Row>
        <Col xs={12}>
          <h4 className="mb-2">Details</h4>
          <LoadingCard isLoading={isAccountDetailsLoading}>
            <CardBody>
              {accountDetails && (
                <AccountGeneralInfo
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
            <CardBody>{accountDetails && <AccountTransactionsDetails account={accountDetails} />}</CardBody>
          </LoadingCard>
        </Col>
      </Row>
    </>
  );
};

AccountDetails.defaultProps = {};

AccountDetails.propTypes = {
  toggleArchived: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  updateColor: PropTypes.func.isRequired,
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
})(AccountDetails);
