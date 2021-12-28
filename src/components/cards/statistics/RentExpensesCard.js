import React from 'react';
import PropTypes from 'prop-types';

import IconStatisticsCard from 'src/components/cards/statistics/IconStatisticsCard';
import MoneyValue from 'src/components/MoneyValue';

const RentExpensesCard = ({ amount, ...rest }) => (
  <IconStatisticsCard
    icon="ion-md-home"
    color="info"
    title="Total rent expenses"
    content={<MoneyValue amount={amount} />}
    {...rest}
  >
    <i className="tim-icons icon-refresh-01" /> Update Now
  </IconStatisticsCard>
);

RentExpensesCard.defaultProps = {
  amount: 0,
};

RentExpensesCard.propTypes = {
  amount: PropTypes.number,
};

export default RentExpensesCard;
