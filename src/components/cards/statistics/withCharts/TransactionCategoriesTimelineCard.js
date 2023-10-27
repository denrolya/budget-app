import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { connect } from 'react-redux';
import {
  Button, Col, FormGroup, Input, InputGroup, InputGroupText, Row,
} from 'reactstrap';

import TransactionCategoriesTimelineChart from 'src/components/charts/recharts/line/TransactionCategoriesTimeline';
import IntervalSwitch from 'src/components/IntervalSwitch';
import CategoryTypeahead from 'src/components/CategoryTypeahead';
import {
  DATERANGE_PICKER_RANGES,
  MOMENT_DATE_FORMAT,
  MOMENT_DATETIME_FORMAT,
  MOMENT_DEFAULT_DATE_FORMAT, MOMENT_VIEW_DATE_WITH_YEAR_FORMAT,
} from 'src/constants/datetime';
import { API } from 'src/constants/api';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import { useCategories } from 'src/contexts/CategoriesContext';
import NoCategoriesSelectedMessage from 'src/components/messages/NoCategoriesSelectedMessage';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { fetchStatistics } from 'src/store/actions/statistics';
import { rangeToString } from 'src/utils/datetime';
import { randomTransactionCategoriesTimelineData } from 'src/utils/randomData';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  after: moment().startOf('year'),
  before: moment().endOf('year'),
  interval: '1 month',
  path: API.timeline,
};

export const TransactionCategoriesTimelineCard = ({ updateStatisticsTrigger, fetchStatistics, config }) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [isLoading, setIsLoading] = useState(false);
  const categories = useCategories();
  const [model, setModel] = useState(new TimeperiodIntervalStatistics({
    data: {
      data: randomTransactionCategoriesTimelineData(),
      categories: categories.filter((c) => c?.root === null && c.type === EXPENSE_TYPE && c.isTechnical === false).map((c) => c.id),
    },
    from: moment().startOf('year'),
    to: moment().endOf('year'),
  }));
  const [selectedCategories, setSelectedCategories] = useState([]);
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
      setIsLoading(true);
      const params = {
        after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
        before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        interval: model.interval,
        categories: model.data.categories,
      };
      const data = await fetchStatistics({ ...config, params });
      setModel(model.setIn('data.data'.split('.'), data));
      setIsLoading(false);
    };

    fetchData();
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), model.data.categories.length, interval, updateStatisticsTrigger]);

  useEffect(() => {
    setModel(model.merge({
      from: config.after,
      to: config.before,
      interval: config.interval,
    }));
  }, [config.after, config.before, config.interval]);

  useEffect(() => {
    setSelectedCategories(model.data.categories.map((id) => categories.find((cat) => cat.id === id)).slice(0, 5));
  }, []);

  return (
    <TimeperiodStatisticsCard
      className="card-chart pb-0"
      header={(
        <>
          <Row className="align-center">
            <Col xs={4}>
              <DateRangePicker
                autoApply
                showCustomRangeLabel
                alwaysShowCalendars
                containerClass="d-block"
                locale={{ format: MOMENT_DATE_FORMAT }}
                startDate={from}
                endDate={to}
                ranges={DATERANGE_PICKER_RANGES}
                initialSettings={{ showDropdowns: true }}
                onApply={(_event, { startDate, endDate }) => setModel(
                  model.merge({
                    from: startDate,
                    to: endDate,
                  }),
                )}
              >
                <Input
                  readOnly
                  bsSize="sm"
                  value={`${from.format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)} - ${to.format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}`}
                />
              </DateRangePicker>
            </Col>
            <Col className="px-1" xs={2}>
              <Input
                type="select"
                bsSize="sm"
                value={interval}
                onChange={(e) => setModel(model.set('interval', e.target.value))}
              >
                <option value="1 day">
                  Day
                </option>
                <option value="1 week">
                  Week
                </option>
                <option value="1 month">
                  Month
                </option>
              </Input>
            </Col>
            <Col xs={6}>
              <CategoryTypeahead selected={selectedCategories} onChange={selectCategories} />
            </Col>
          </Row>

          <hr className="my-1" />
        </>
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
  updateStatisticsTrigger: false,
};

TransactionCategoriesTimelineCard.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    interval: PropTypes.string,
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = ({ ui: { updateStatisticsTrigger } }) => ({ updateStatisticsTrigger });

export default connect(mapStateToProps, { fetchStatistics })(TransactionCategoriesTimelineCard);
