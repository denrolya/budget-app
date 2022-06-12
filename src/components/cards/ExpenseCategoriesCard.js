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

  if (!data.hasChildren()) {
    return (
      <CenteredMessage
        className="mb-4"
        title="No statistics available for selected period."
        message="Try to select another date range in upper right corner of this card."
      />
    );
  }

  return (
    <Row noGutters>
      <Col md={12} lg={12} xl={8}>
        <TransactionCategories data={data} selectedCategory={selectedCategory} onClick={selectCategory} />
      </Col>
      <Col md={12} lg={12} xl={4}>
        <TimeperiodStatisticsCard
          isLoading={isLoading}
          className="card-expense-categories"
          model={model}
          onUpdate={onUpdate}
        >
          <ExpenseCategoriesList
            data={data}
            onCategorySelect={selectCategory}
            selectedCategory={selectedCategory}
            from={from}
            to={to}
          />
        </TimeperiodStatisticsCard>
      </Col>
    </Row>
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
