import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row } from 'reactstrap';

import CarouselWithSwipe from 'src/components/CarouselWithSwipe';
import TotalValue from 'src/components/cards/statistics/generic/TotalValue';
import IncomeExpenseCard from 'src/components/cards/statistics/withCharts/IncomeExpenseCard';
import CategoryTreeCard from 'src/components/cards/statistics/withCharts/CategoryTreeCard';
import TransactionCategoriesTimelineCard from 'src/components/cards/statistics/withCharts/TransactionCategoriesTimelineCard';

import { randomString } from 'src/utils/randomData';

const Dashboard = () => {
  /* eslint-disable react/no-unstable-nested-components */
  const shortStatistics = [
    <TotalValue
      config={{
        name: 'totalExpenses',
      }}
    />,
    <TotalValue
      config={{
        type: 'daily',
        name: 'dailyExpenses',
        footerType: 'amount',
      }}
    />,
    <TotalValue
      config={{
        type: 'daily',
        name: 'foodExpenses',
        categories: [1],
      }}
    />,
    <TotalValue
      config={{
        name: 'foodExpenses',
        footerType: 'amount',
        categories: [2, 18],
      }}
    />,
  ];
  /* eslint-enable react/no-unstable-nested-components */

  return (
    <>
      <Helmet>
        <title>
          Dashboard | Budget
        </title>
      </Helmet>

      <div className="dashboard">
        <Row>
          <Col md={9}>
            <Row>
              <Col md={12}>
                <IncomeExpenseCard
                  config={{
                    name: 'incomeExpense',
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={12} className="d-md-none">
                <CarouselWithSwipe data={shortStatistics} />
              </Col>

              {shortStatistics.map((item) => (
                <Col md={6} lg={3} className="d-none d-md-block" key={randomString(4)}>
                  { item }
                </Col>
              ))}

              <Col sm={12}>
                <TransactionCategoriesTimelineCard
                  config={{
                    name: 'categoriesTimeline',
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            <CategoryTreeCard
              config={{
                name: 'expenseCategoryTree',
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

Dashboard.defaultProps = {};

Dashboard.propTypes = { };

export default Dashboard;
