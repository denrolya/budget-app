import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardFooter, CardHeader } from 'reactstrap';

const TotalAssetsCard = ({ amount }) => (
  <Card className="card-stats">
    <CardHeader>
      <h5 className="card-title">Total Assets</h5>
    </CardHeader>
    <CardFooter>
      <hr />
      <div className="stats">
        <i className="tim-icons icon-money-coins" /> € {amount.toFixed(2)}
      </div>
    </CardFooter>
  </Card>
);

TotalAssetsCard.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default TotalAssetsCard;
