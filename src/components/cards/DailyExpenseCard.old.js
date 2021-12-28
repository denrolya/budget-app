import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardFooter, CardHeader } from 'reactstrap';

import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { amountInPercentage, expenseIconColorFromPercentage } from 'src/services/common';
import { generateLinkToExpenses } from 'src/services/routing';

const DailyExpenseCard = ({ forToday, previousMonthDailyAverage }) => {
  const percentage = previousMonthDailyAverage > 0 ? amountInPercentage(previousMonthDailyAverage, forToday) : 0;
  const percentageInColor = expenseIconColorFromPercentage(percentage);
  const todayString = moment().format(MOMENT_DATE_FORMAT);

  return (
    <Link component={Card} to={generateLinkToExpenses(todayString, todayString)} className="card-stats card-link">
      <CardHeader>
        <h5 className="card-title">
          Today's Expenses
          <span className={`pull-right text-${percentageInColor}`}>{percentage}%</span>
        </h5>
      </CardHeader>
      <CardFooter>
        <hr />
        <div className="stats clearfix">
          <div className="float-left">
            <i className="tim-icons icon-money-coins" />€ {forToday} / € {previousMonthDailyAverage}
          </div>
          <div className="float-right" />
        </div>
      </CardFooter>
    </Link>
  );
};

DailyExpenseCard.propTypes = {
  forToday: PropTypes.number.isRequired,
  previousMonthDailyAverage: PropTypes.number.isRequired,
};

export default DailyExpenseCard;
