import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardFooter, CardHeader } from 'reactstrap';

import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { amountInPercentage } from 'src/services/common';
import { generateLinkToExpenses } from 'src/services/routing';

const MonthExpenseCard = ({ twoMonthsAgo, monthAgo, currentMonthProjected }) => {
  const percentage = monthAgo > 0 ? amountInPercentage(monthAgo, currentMonthProjected) - 100 : 0;
  const percentageInColor = currentMonthProjected - monthAgo >= 0 ? 'danger' : 'success';
  const secondMonthAgo = {
    from: moment().subtract(2, 'months').startOf('month').format(MOMENT_DATE_FORMAT),
    to: moment().subtract(2, 'months').endOf('month').format(MOMENT_DATE_FORMAT),
  };
  const firstMonthAgo = {
    from: moment().subtract(1, 'months').startOf('month').format(MOMENT_DATE_FORMAT),
    to: moment().subtract(1, 'months').endOf('month').format(MOMENT_DATE_FORMAT),
  };
  const currentMonth = {
    from: moment().startOf('month').format(MOMENT_DATE_FORMAT),
    to: moment().endOf('month').format(MOMENT_DATE_FORMAT),
  };

  return (
    <Card className="card-stats">
      <CardHeader>
        <h5 className="card-title">
          3 Month Expenses
          <span className={`pull-right text-${percentageInColor}`}>
            {percentage > 0 ? '+' : ''}
            {percentage.toFixed(2)}
            %
          </span>
        </h5>
      </CardHeader>
      <CardFooter>
        <hr />
        <div className="stats">
          <i className="tim-icons icon-money-coins" />
          <Link to={generateLinkToExpenses(secondMonthAgo.from, secondMonthAgo.to)}>
            €
            {twoMonthsAgo}
          </Link>
          {' '}
          /
          <Link to={generateLinkToExpenses(firstMonthAgo.from, firstMonthAgo.to)}>
            €
            {monthAgo}
          </Link>
          {' '}
          /
          <Link to={generateLinkToExpenses(currentMonth.from, currentMonth.to)}>
            €
            {currentMonthProjected}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

MonthExpenseCard.propTypes = {
  twoMonthsAgo: PropTypes.number.isRequired,
  monthAgo: PropTypes.number.isRequired,
  currentMonthProjected: PropTypes.number.isRequired,
};

export default MonthExpenseCard;
