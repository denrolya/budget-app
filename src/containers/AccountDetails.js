import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row, Col, CardBody } from 'reactstrap';

import LoadingCard from 'src/components/cards/LoadingCard';
import CenteredMessage from 'src/components/messages/CenteredMessage';
import {
  accountArchivationPrompt,
  accountNameChangePrompt,
  accountRestorationPrompt,
} from 'src/services/prompts';
import {
  toggleArchived, fetchDetail, updateName, updateColor,
} from 'src/store/actions/account';
import AccountGeneralInfo from 'src/components/AccountGeneralInfo';
import { formatDetails } from 'src/services/account';
import AccountTransactionsDetails from 'src/components/AccountTransactionsDetails';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { notify } from 'src/store/actions/global';

const AccountDetails = ({
  exchangeRates,
  updateName,
  updateColor,
  toggleArchived,
}) => {
  const { id = null } = useParams();
  const { code } = useBaseCurrency();
  const [accountDetails, setAccountDetails] = useState();
  const [isLoading, setIsLoading] = useState(null);

  const hasData = isLoading === false && !!accountDetails;

  const fetchAccountDetails = async (id) => {
    setIsLoading(true);

    try {
      const { data } = await fetchDetail(id);
      setIsLoading(false);
      setAccountDetails(formatDetails(data, code));
    } catch (e) {
      setIsLoading(false);
      notify('error', 'Error fetching account details');
    }
  };

  useEffect(() => {
    if (id) {
      fetchAccountDetails(id);
    } else {
      setAccountDetails();
    }
  }, [id]);

  const onArchiveClick = async (account) => {
    const { isConfirmed } = await accountArchivationPrompt(account);
    if (!isConfirmed) {
      return;
    }

    await toggleArchived(account.id, false);
    await fetchAccountDetails(account.id);
  };

  const onRestoreClick = async (account) => {
    const { isConfirmed } = await accountRestorationPrompt(account);
    if (!isConfirmed) {
      return;
    }

    await toggleArchived(account.id, true);
    await fetchAccountDetails(account.id);
  };

  const onNameChange = async (account, newName) => {
    const { isConfirmed } = await accountNameChangePrompt(account, newName);
    if (!isConfirmed) {
      return;
    }

    await updateName(account, newName);
    await fetchAccountDetails(account.id);
  };

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
          <LoadingCard isLoading={isLoading}>
            <CardBody>
              {hasData && (
                <AccountGeneralInfo
                  data={accountDetails}
                  exchangeRates={exchangeRates}
                  onNameChange={onNameChange}
                  onColorChange={onColorChange}
                  onArchive={onArchiveClick}
                  onRestore={onRestoreClick}
                />
              )}
              {!hasData && (
                <CenteredMessage title="No data" message="No account data is available at the moment" />
              )}
            </CardBody>
          </LoadingCard>
        </Col>
        <Col xs={12} md={9}>
          <h4 className="mb-2">Transactions</h4>
          <LoadingCard isLoading={isLoading}>
            <CardBody>
              {hasData && (
                <AccountTransactionsDetails account={accountDetails} />
              )}
              {!hasData && (
                <CenteredMessage title="No data" message="No account data is available at the moment" />
              )}
            </CardBody>
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

const mapStateToProps = ({ exchangeRates }) => ({ exchangeRates });

export default connect(mapStateToProps, {
  toggleArchived,
  updateName,
  updateColor,
})(AccountDetails);
