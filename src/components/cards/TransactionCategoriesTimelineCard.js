import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Button, Row, Col } from 'reactstrap';

import TransactionCategoriesTimelineChart from 'src/components/charts/recharts/line/TransactionCategoriesTimeline';
import { TRANSACTION_TYPES, TRANSACTIONS_CATEGORIES_PRESETS as PRESETS } from 'src/constants/transactions';
import { fetchCategories } from 'src/store/actions/category';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import NoCategoriesSelectedMessage from 'src/components/messages/NoCategoriesSelectedMessage';

export const TransactionCategoriesTimelineCard = ({ isLoading, model, onUpdate }) => {
  const typeaheads = [];
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLineChart, setIsLineChart] = useState(true);

  useEffect(() => {
    fetchCategories().then((res) => setCategoriesOptions(res));
  }, []);

  const selectCategories = (categories) => {
    setSelectedCategories(categories);
    onUpdate(
      model.setIn(
        'data.categories'.split('.'),
        categories.map(({ id }) => id),
      ),
    );
  };

  const setCategoriesFromPresets = (presetCategoriesIds) => selectCategories(presetCategoriesIds.map((id) => categoriesOptions.find((c) => c.id === id)));

  useEffect(() => {
    if (categoriesOptions.length > 0) {
      setSelectedCategories(model.data.categories.map((id) => categoriesOptions.find((cat) => cat.id === id)));
    }
  }, [categoriesOptions]);

  return (
    <TimeperiodStatisticsCard
      className="card-chart"
      title="Categories timeline"
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
      <Typeahead
        multiple
        id="categories"
        labelKey="name"
        placeholder="Filter by categories..."
        className="mb-3"
        onChange={selectCategories}
        selected={selectedCategories}
        ref={(t) => typeaheads.push(t)}
        options={categoriesOptions.filter(
          ({ type, name }) => TRANSACTION_TYPES.includes(type) && !model.data.categories.includes(name),
        )}
      />

      {model.data.data && <TransactionCategoriesTimelineChart data={model.data.data} interval={model.interval} />}

      {!model.data.data && <NoCategoriesSelectedMessage />}
      <Row>
        <Col>
          {PRESETS.map(({ name, categoryIds }) => (
            <Button
              size="sm"
              color="info"
              className="btn-simple"
              key={`categories-preset-${name}`}
              active={isEqual(model.data.categories.sort(), categoryIds.sort())}
              onClick={() => setCategoriesFromPresets(categoryIds)}
            >
              {name}
            </Button>
          ))}
        </Col>
        <Col className="text-right">
          <Button
            size="sm"
            color="info"
            className="btn-simple"
            active={!isLineChart}
            onClick={() => setIsLineChart(!isLineChart)}
          >
            <i aria-hidden className="ion-ios-stats" />
          </Button>
        </Col>
      </Row>
    </TimeperiodStatisticsCard>
  );
};

TransactionCategoriesTimelineCard.defaultProps = {
  isLoading: false,
};

TransactionCategoriesTimelineCard.propTypes = {
  model: PropTypes.instanceOf(TimeperiodIntervalStatistics).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default TransactionCategoriesTimelineCard;
