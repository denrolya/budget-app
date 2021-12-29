import React from 'react';
import cn from 'classnames';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  CardBody, CardFooter, Col, Row, Table,
} from 'reactstrap';

import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { amountInPercentage, expenseIconColorFromPercentage } from 'src/services/common';
import { generateLinkToExpenses } from 'src/services/routing';
import LoadingCard from 'src/components/cards/LoadingCard';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const DailyExpenseCard = ({ forToday, previousMonthDailyAverage, isLoading }) => {
  const { symbol } = useBaseCurrency();
  const todayString = moment().format(MOMENT_DATE_FORMAT);
  const previousMonth = moment().subtract(1, 'months').startOf('month');
  const percentage = previousMonthDailyAverage > 0 ? amountInPercentage(previousMonthDailyAverage, forToday) : 0;
  const percentageInColor = expenseIconColorFromPercentage(percentage);

  return (
    <LoadingCard isLoading={isLoading} className="card-stats">
      <CardBody className="pb-0">
        <Row>
          <Col>
            <h5 className="text-muted mb-0 text-white card-category text-capitalize">
              Today's Expenses
              <span className="pull-right text-info text-nowrap d-xs-inline d-sm-none">
                {symbol}
                {' '}
                {previousMonthDailyAverage}
              </span>
            </h5>
            <sup className={cn(`text-${percentageInColor}`)}>
              {symbol}
              {' '}
            </sup>
            <span className={cn('h2', `text-${percentageInColor}`)}>{forToday}</span>

            <Table borderless size="sm" className="mt-3 mb-0 d-none d-sm-block">
              <tbody>
                <tr>
                  <td>
                    <span className="text-info text-nowrap mr-2">
                      {symbol}
                      {' '}
                      {previousMonthDailyAverage}
                    </span>
                    <span className="text-nowrap text-light">
                      Avg. daily expense in
                      {previousMonth.format('MMMM')}
                    </span>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col className="col-auto d-none d-sm-block">
            <div className="info-icon text-center icon-success" />
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        <hr />
        <div className="stats">
          <Link to={generateLinkToExpenses(todayString, todayString)}>
            <i className="mdi mdi-format-list-bulleted" />
            {' '}
            See today's expenses
          </Link>
        </div>
      </CardFooter>
    </LoadingCard>
  );
};

DailyExpenseCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  forToday: PropTypes.number.isRequired,
  previousMonthDailyAverage: PropTypes.number.isRequired,
};

export default DailyExpenseCard;
