import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';

import Breadcrumbs from 'src/components/ExpenseCategoriesBreadcrumbs';
import ExpenseCategoriesChart from 'src/components/charts/ExpenseCategoriesPieChart';
import ExpenseCategoriesList from 'src/components/ExpenseCategoriesList';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import CenteredMessage from 'src/components/messages/CenteredMessage';

const ExpenseCategoriesCard = ({ isLoading, model, onUpdate }) => {
  const { from, to, data } = model;
  const [selectedCategory, selectCategory] = useState(data.model.name);

  return (
    <TimeperiodStatisticsCard
      className="card-expense-categories"
      isLoading={isLoading}
      title={<Breadcrumbs selectedCategory={selectedCategory} selectCategory={selectCategory} data={model.data} />}
      model={model}
      onUpdate={onUpdate}
    >
      {data.hasChildren() && (
        <Row>
          <Col className="order-last order-xl-first d-flex flex-column" md={12} lg={12} xl={5}>
            <ExpenseCategoriesList
              data={data}
              onCategorySelect={selectCategory}
              selectedCategory={selectedCategory}
              from={from}
              to={to}
            />
          </Col>
          <Col className="order-first order-xl-last d-flex justify-content-center pb-4" md={12} lg={12} xl={7}>
            <ExpenseCategoriesChart
              height={null}
              onClick={selectCategory}
              selectedCategory={selectedCategory}
              data={data}
            />
          </Col>
        </Row>
      )}
      {!data.hasChildren() && (
        <CenteredMessage
          className="mb-4"
          title="No statistics available for selected period."
          message="Try to select another date range in upper right corner of this card."
        />
      )}
    </TimeperiodStatisticsCard>
  );
};

ExpenseCategoriesCard.defaultProps = {
  isLoading: false,
};

ExpenseCategoriesCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ExpenseCategoriesCard;
