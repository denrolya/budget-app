import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { generatePreviousPeriod } from 'src/utils/datetime';
import { MOMENT_DEFAULT_DATE_FORMAT, MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { generateCategoriesStatisticsTree } from 'src/utils/category';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import { PATHS } from 'src/constants/statistics';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import { useCategories } from 'src/contexts/CategoriesContext';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TransactionCategoriesComparison from 'src/components/charts/recharts/bar/TransactionCategoriesComparison';
import { fetchStatistics } from 'src/store/actions/statistics';

const TAG_REPORT_NAME = 'report-main';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: PATHS.tree,
  transactionType: EXPENSE_TYPE,
  tag: TAG_REPORT_NAME,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
};

const CategoriesByTagReview = ({
  updateStatisticsTrigger, config, fetchStatistics,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(new TimeperiodStatistics({
    data: [],
    from: config.after,
    to: config.before,
  }));
  const categories = useCategories();

  const reportCategories = useMemo(
    () => categories.filter(({ tags, type }) => type === config.transactionType && tags.some(({ name }) => name === config.tag)),
    [categories.length, config.transactionType],
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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

      const tree = generateCategoriesStatisticsTree(selectedPeriodData, previousPeriodData);

      setModel(
        model.set(
          'data',
          reportCategories.map((c) => tree.first(({ model: { name } }) => name === c.name)?.model),
        ),
      );
      setIsLoading(false);
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
      header="Main expense categories"
      className="card-chart"
      isLoading={isLoading}
    >
      <TransactionCategoriesComparison data={model.data} selectedYear={model.from.year()} />
    </TimeperiodStatisticsCard>
  );
};

CategoriesByTagReview.defaultProps = {
  config: DEFAULT_CONFIG,
  updateStatisticsTrigger: false,
};

CategoriesByTagReview.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
    path: PropTypes.string,
    tag: PropTypes.string.isRequired,
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = ({ ui }) => ({
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(CategoriesByTagReview);
