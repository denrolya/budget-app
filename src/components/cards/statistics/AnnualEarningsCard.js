import React from 'react';
import PropTypes from 'prop-types';

import IconStatisticsCard from 'src/components/cards/statistics/IconStatisticsCard';

const AnnualEarningsCard = ({ amount, ...rest }) => (
  <IconStatisticsCard
    icon="tim-icons icon-money-coins"
    color="success"
    title="Annual earnings"
    content={`€${amount}`}
    {...rest}
  >
    <i className="tim-icons icon-refresh-01" /> Update Now
  </IconStatisticsCard>
);

AnnualEarningsCard.defaultProps = {
  amount: 0,
};

AnnualEarningsCard.propTypes = {
  amount: PropTypes.number,
};

export default AnnualEarningsCard;
