import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row, Container } from 'reactstrap';

import CarouselWithSwipe from 'src/components/CarouselWithSwipe';
import MoneyFlowOnSteroidsCard from 'src/components/cards/statistics/withCharts/MoneyFlowOnSteroidsCard';
import TotalValue from 'src/components/cards/statistics/generic/TotalValue';
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

      <Container fluid className="dashboard">
        <Row>
          <Col md={12}>
            <MoneyFlowOnSteroidsCard
              config={{
                after: moment().startOf('year'),
                before: moment().endOf('year'),
                name: 'moneyFlow',
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <Row>
              {window.isMobile && (
                <Col xs={12} className="d-md-none">
                  <CarouselWithSwipe data={shortStatistics} />
                </Col>
              )}

              {!window.isMobile && shortStatistics.map((item) => (
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
              disabled={false}
              config={{
                name: 'expenseCategoryTree',
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

Dashboard.defaultProps = {};

Dashboard.propTypes = { };

export default Dashboard;
