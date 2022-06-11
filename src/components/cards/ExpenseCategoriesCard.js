import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Col, Row, Card } from 'reactstrap';

import ExpenseCategoriesList from 'src/components/ExpenseCategoriesList';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import CenteredMessage from 'src/components/messages/CenteredMessage';
import TransactionCategories from 'src/components/charts/recharts/pie/TransactionCategories';

const ExpenseCategoriesCard = ({ isLoading, model, onUpdate }) => {
  const { from, to, data } = model;
  const [selectedCategory, selectCategory] = useState(data.model.name);

  return (
    <TimeperiodStatisticsCard
      transparent
      className="card-expense-categories"
      bodyClassName="p-0"
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      {data.hasChildren() && (
        <Row>
          <Col className="order-last order-xl-last" md={12} lg={12} xl={4}>
            <Card body style={{ flex: 'inherit' }}>
              <ExpenseCategoriesList
                data={data}
                onCategorySelect={selectCategory}
                selectedCategory={selectedCategory}
                from={from}
                to={to}
              />
            </Card>
          </Col>
          <Col className="order-first order-xl-first" md={12} lg={12} xl={8}>
            <TransactionCategories data={data} selectedCategory={selectedCategory} onClick={selectCategory} />
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
