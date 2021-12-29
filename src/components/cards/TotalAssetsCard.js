import PropTypes from 'prop-types';
import React from 'react';
import {
  Card, CardBody, CardTitle, Col, Row,
} from 'reactstrap';

const TotalAssetsCard = ({ amount }) => (
  <Card className="card-stats">
    <CardBody>
      <Row>
        <Col>
          <h5 className="text-uppercase text-muted mb-0 text-white card-title">Total Assets</h5>
          <CardTitle tag="h2" className="font-weight-bold mb-0 text-white">
            €
            {' '}
            {amount.toFixed(2)}
          </CardTitle>
        </Col>
        <Col className="col-auto">
          <div className="info-icon text-center icon-warning" />
        </Col>
      </Row>
    </CardBody>
  </Card>
);

TotalAssetsCard.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default TotalAssetsCard;
