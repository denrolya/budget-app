import React from 'react';
import PropTypes from 'prop-types';

import IconStatisticsCard from 'src/components/cards/statistics/IconStatisticsCard';
import MoneyValue from 'src/components/MoneyValue';

const AvgCategoryExpenseCard = ({
  categoryName, amount, icon, ...rest
}) => (
  <IconStatisticsCard
    icon={icon}
    color="info"
    title={`Avg ${categoryName} expenses`}
    content={<MoneyValue amount={amount} />}
    {...rest}
  />
);

AvgCategoryExpenseCard.defaultProps = {
  amount: 0,
};

AvgCategoryExpenseCard.propTypes = {
  categoryName: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  amount: PropTypes.number,
};

export default AvgCategoryExpenseCard;
