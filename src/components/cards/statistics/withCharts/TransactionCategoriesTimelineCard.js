import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Button } from 'reactstrap';

import TransactionCategoriesTimelineChart from 'src/components/charts/recharts/line/TransactionCategoriesTimeline';
import { TRANSACTION_TYPES, TRANSACTIONS_CATEGORIES_PRESETS as PRESETS } from 'src/constants/transactions';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { useCategories } from 'src/contexts/CategoriesContext';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import NoCategoriesSelectedMessage from 'src/components/messages/NoCategoriesSelectedMessage';

export const TransactionCategoriesTimelineCard = ({
  isLoading, model, onUpdate,
}) => {
  const categories = useCategories();
  const typeaheads = [];
  const [selectedCategories, setSelectedCategories] = useState([]);

  const selectCategories = (selected) => {
    setSelectedCategories(selected);
    onUpdate(
      model.setIn(
        'data.categories'.split('.'),
        selected.map(({ id }) => id),
      ),
    );
  };

  const setCategoriesFromPresets = (presetCategoriesIds) => selectCategories(presetCategoriesIds.map((id) => categories.find((c) => c.id === id)));

  useEffect(() => {
    setSelectedCategories(model.data.categories.map((id) => categories.find((cat) => cat.id === id)));
  }, []);

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
        options={categories.filter(
          ({ type, name }) => TRANSACTION_TYPES.includes(type) && !model.data.categories.includes(name),
        )}
      />

      {model.data.data && <TransactionCategoriesTimelineChart data={model.data.data} interval={model.interval} />}

      {!model.data.data && <NoCategoriesSelectedMessage />}
      <div className="d-flex justify-content-between py-1">
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
      </div>

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
