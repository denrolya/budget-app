import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { connect } from 'react-redux';
import TreeModel from 'tree-model';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import CategoriesList from 'src/components/CategoriesList';
import {
  DATERANGE_PICKER_RANGES,
  MOMENT_DATE_FORMAT,
  MOMENT_DATETIME_FORMAT,
  MOMENT_DEFAULT_DATE_FORMAT,
} from 'src/constants/datetime';
import { PATHS } from 'src/constants/statistics';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import CenteredMessage from 'src/components/messages/CenteredMessage';
import TransactionCategories from 'src/components/charts/recharts/pie/TransactionCategories';
import Breadcrumbs from 'src/components/CategoriesBreadcrumbs';
import { fetchStatistics } from 'src/store/actions/statistics';
import { generateCategoriesStatisticsTree } from 'src/utils/category';
import { isActionLoading } from 'src/utils/common';
import { generatePreviousPeriod, rangeToString } from 'src/utils/datetime';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: PATHS.tree,
  transactionType: EXPENSE_TYPE,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
};

// FIXME: If it's a tree for incomes percentage and colors should be inverted
const CategoryTreeCard = ({
  isLoading, updateStatisticsTrigger, config, fetchStatistics,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [model, setModel] = useState(new TimeperiodStatistics({
    data: new TreeModel().parse({
      name: 'All categories',
      total: 0,
      value: 0,
      previous: 0,
    }),
    from: config.after,
    to: config.before,
  }));
  const { from, to, data } = model;
  const [selectedCategory, selectCategory] = useState(data.model.name);

  useEffect(() => {
    const fetchData = async () => {
      const selectedPeriodData = await fetchStatistics({
        ...config,
        params: {
          type: config.transactionType,
          after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
          before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        },
      });

      const previousPeriod = generatePreviousPeriod(model.from, model.to);

      const previousPeriodData = await fetchStatistics({
        ...config,
        params: {
          type: config.transactionType,
          after: previousPeriod.from.format(MOMENT_DEFAULT_DATE_FORMAT),
          before: previousPeriod.to.format(MOMENT_DEFAULT_DATE_FORMAT),
        },
      });

      setModel(
        model.set(
          'data',
          generateCategoriesStatisticsTree(selectedPeriodData, previousPeriodData),
        ),
      );
    };

    fetchData();
  }, [model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT), updateStatisticsTrigger]);

  useEffect(() => {
    setModel(model.merge({
      from: config.after,
      to: config.before,
    }));
  }, [config.after, config.before]);

  return (
    <TimeperiodStatisticsCard
      className="card-category-tree"
      isLoading={isLoading}
      header={(
        <>
          <Breadcrumbs
            className="mb-2"
            selectedCategory={selectedCategory}
            selectCategory={selectCategory}
            tree={data}
          />

          <span className="d-block text-right">
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
        </>
      )}
    >
      {!data.hasChildren() && (
        <CenteredMessage
          className="mb-4"
          title="No statistics available for selected period."
          message="Try to select another date range in upper right corner of this card."
        />
      )}

      <div className="mb-3">
        <TransactionCategories data={data} selectedCategory={selectedCategory} onClick={selectCategory} />
      </div>

      <CategoriesList
        data={data}
        onCategorySelect={selectCategory}
        selectedCategory={selectedCategory}
        after={from}
        before={to}
      />
    </TimeperiodStatisticsCard>
  );
};

CategoryTreeCard.defaultProps = {
  config: DEFAULT_CONFIG,
  isLoading: false,
  updateStatisticsTrigger: false,
};

CategoryTreeCard.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
    path: PropTypes.string,
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ ui }, { config }) => ({
  isLoading: isActionLoading(ui[`STATISTICS_FETCH_${upperCase(snakeCase(config.name))}`]),
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(CategoryTreeCard);
