import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import TransactionCategoriesTimelineChart from 'src/components/charts/recharts/line/TransactionCategoriesTimeline';
import IntervalSwitch from 'src/components/IntervalSwitch';
import {
  DATERANGE_PICKER_RANGES,
  MOMENT_DATE_FORMAT,
  MOMENT_DATETIME_FORMAT,
  MOMENT_DEFAULT_DATE_FORMAT,
} from 'src/constants/datetime';
import { PATHS } from 'src/constants/statistics';
import { TRANSACTION_TYPES } from 'src/constants/transactions';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { useCategories } from 'src/contexts/CategoriesContext';
import NoCategoriesSelectedMessage from 'src/components/messages/NoCategoriesSelectedMessage';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { fetchStatistics } from 'src/store/actions/statistics';
import { isActionLoading } from 'src/utils/common';
import { rangeToString } from 'src/utils/datetime';
import { randomTransactionCategoriesTimelineData } from 'src/utils/randomData';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: PATHS.timeline,
};

export const TransactionCategoriesTimelineCard = ({
  isLoading, updateStatisticsTrigger, fetchStatistics, config,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [model, setModel] = useState(new TimeperiodIntervalStatistics({
    data: {
      data: randomTransactionCategoriesTimelineData(),
      categories: [1, 2, 4],
    },
    from: moment().startOf('year'),
    to: moment().endOf('year'),
  }));
  const categories = useCategories();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const typeaheads = [];
  const { from, to, interval } = model;

  const selectCategories = (selected) => {
    setSelectedCategories(selected);
    setModel(
      model.setIn(
        'data.categories'.split('.'),
        selected.map(({ id }) => id),
      ),
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
        before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        interval: model.interval,
        categories: model.data.categories,
      };
      const data = await fetchStatistics({ ...config, params });
      setModel(model.setIn('data.data'.split('.'), data));
    };

    fetchData();
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), interval, model.data.categories.length, updateStatisticsTrigger]);

  useEffect(() => {
    setSelectedCategories(model.data.categories.map((id) => categories.find((cat) => cat.id === id)));
  }, []);

  return (
    <TimeperiodStatisticsCard
      className="card-chart pb-0"
      header={(
        <Row noGutters>
          <Col xs={2}>
            <span className="small">
              <DateRangePicker
                autoApply
                showCustomRangeLabel
                alwaysShowCalendars={false}
                locale={{ format: MOMENT_DATE_FORMAT }}
                startDate={from}
                endDate={to}
                ranges={DATERANGE_PICKER_RANGES}
                onApply={(_event, { startDate, endDate }) => setModel(
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
            </span>
          </Col>

          <Col xs={6}>
            <Typeahead
              multiple
              id="categories"
              labelKey="name"
              placeholder="Filter by categories..."
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
              onIntervalSwitch={(v) => setModel(model.set('interval', v))}
            />
          </Col>
        </Row>
      )}
      isLoading={isLoading}
    >
      {model.data.data && <TransactionCategoriesTimelineChart data={model.data.data} interval={model.interval} />}

      {!model.data.data && <NoCategoriesSelectedMessage />}
    </TimeperiodStatisticsCard>
  );
};

TransactionCategoriesTimelineCard.defaultProps = {
  config: DEFAULT_CONFIG,
  isLoading: false,
  updateStatisticsTrigger: false,
};

TransactionCategoriesTimelineCard.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ ui }, { config }) => ({
  isLoading: isActionLoading(ui[`STATISTICS_FETCH_${upperCase(snakeCase(config.name))}`]),
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(TransactionCategoriesTimelineCard);
