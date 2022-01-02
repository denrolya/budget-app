import PropTypes from 'prop-types';
import React from 'react';
import {
  Card, CardBody, CardTitle, Col, Row,
} from 'reactstrap';

import accountType from 'src/types/account';
import { CurrencyIcon } from 'src/components/CurrencyIcon';

const AccountCard = ({ account, toggleEdit }) => (
  <Card className="card-stats">
    <CardBody>
      <Row>
        <Col xs={2}>
          <CurrencyIcon currency={account.currency} />
        </Col>
        <Col xs={10}>
          <Col>
            <h5 className="text-uppercase text-muted mb-0 text-white card-title">{account.name}</h5>
            <CardTitle tag="h3" className="font-weight-bolder">
              {account.balance}
            </CardTitle>
          </Col>
        </Col>
      </Row>
    </CardBody>
  </Card>
);

AccountCard.propTypes = {
  account: accountType.isRequired,
  toggleEdit: PropTypes.func.isRequired,
};

export default AccountCard;
