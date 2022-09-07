import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Button, Col, Row } from 'reactstrap';

import TransactionCategoriesTimelineChart from 'src/components/charts/recharts/line/TransactionCategoriesTimeline';
import IntervalSwitch from 'src/components/IntervalSwitch';
import { DATERANGE_PICKER_RANGES, MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { TRANSACTION_TYPES, TRANSACTIONS_CATEGORIES_PRESETS as PRESETS } from 'src/constants/transactions';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { useCategories } from 'src/contexts/CategoriesContext';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import NoCategoriesSelectedMessage from 'src/components/messages/NoCategoriesSelectedMessage';
import { rangeToString } from 'src/utils/datetime';

export const TransactionCategoriesTimelineCard = ({
  isLoading, model, onUpdate,
}) => {
  const { from, to, interval } = model;
  const typeaheads = [];
  const categories = useCategories();
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
      header={(
        <Row noGutters>
          <Col xs={2}>
            <DateRangePicker
              autoApply
              showCustomRangeLabel
              alwaysShowCalendars={false}
              locale={{ format: MOMENT_DATE_FORMAT }}
              startDate={from}
              endDate={to}
              ranges={DATERANGE_PICKER_RANGES}
              onApply={(_event, { startDate, endDate }) => onUpdate(
                model.merge({
                  from: startDate,
                  to: endDate,
                }),
              )}
            >
              <span className="cursor-pointer text-nowrap">
                <i aria-hidden className="ion-ios-calendar" />
                {'  '}
                {rangeToString(from, to)}
              </span>
            </DateRangePicker>
          </Col>

          <Col xs={6}>

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
          </Col>

          <Col className="text-right" xs={4}>
            <IntervalSwitch
              selected={interval}
              from={from}
              to={to}
              onIntervalSwitch={(v) => onUpdate(model.set('interval', v))}
            />
          </Col>
        </Row>
      )}
      isLoading={isLoading}
      model={model}
      onUpdate={onUpdate}
    >
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
