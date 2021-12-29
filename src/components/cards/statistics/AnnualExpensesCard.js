import React from 'react';
import PropTypes from 'prop-types';

import IconStatisticsCard from 'src/components/cards/statistics/IconStatisticsCard';
import MoneyValue from 'src/components/MoneyValue';

const AnnualExpensesCard = ({ amount, ...rest }) => (
  <IconStatisticsCard
    icon="tim-icons icon-paper"
    color="warning"
    title="Spent this year"
    content={<MoneyValue amount={amount} />}
    {...rest}
  >
    <i className="tim-icons icon-refresh-01" />
    {' '}
    Update Now
  </IconStatisticsCard>
);

AnnualExpensesCard.defaultProps = {
  amount: 0,
};

AnnualExpensesCard.propTypes = {
  amount: PropTypes.number,
};

export default AnnualExpensesCard;
