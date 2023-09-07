import moment from 'moment-timezone';
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Progress, Table } from 'reactstrap';
import TreeModel from 'tree-model';

import { MOMENT_DATETIME_FORMAT, MOMENT_DEFAULT_DATE_FORMAT } from 'src/constants/datetime';
import { PATHS } from 'src/constants/statistics';
import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import MoneyValue from 'src/components/MoneyValue';
import { useCategories } from 'src/contexts/CategoriesContext';
import TimeperiodStatisticsCard from 'src/components/cards/TimeperiodStatisticsCard';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import { fetchStatistics } from 'src/store/actions/statistics';
import { generateCategoriesStatisticsTree } from 'src/utils/category';
import { amountInPercentage } from 'src/utils/common';

export const DEFAULT_CONFIG = {
  name: '<name_goes_here>',
  path: PATHS.tree,
  transactionType: EXPENSE_TYPE,
  after: moment().startOf('year'),
  before: moment().endOf('year'),
};

/** TODO: Style table as in daily expenses */
const NewCategoriesCard = ({
  updateStatisticsTrigger,
  config,
  fetchStatistics,
}) => {
  // eslint-disable-next-line no-param-reassign
  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(new TimeperiodStatistics({
    data: {
      tree: new TreeModel().parse({
        name: 'All categories',
        total: 0,
        value: 0,
      }),
      newCategories: [],
    },
    from: config.after,
    to: config.before,
  }));
  const categories = useCategories();
  const newCategories = useMemo(
    () => categories.filter(({ type: catType, createdAt }) => catType === config.transactionType && createdAt.isBetween(model.from, model.to)),
    [config.transactionType, categories.length, model.from.format(MOMENT_DATETIME_FORMAT), model.to.format(MOMENT_DATETIME_FORMAT)],
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchStatistics({
        ...config,
        params: {
          type: config.transactionType,
          after: model.from.format(MOMENT_DEFAULT_DATE_FORMAT),
          before: model.to.format(MOMENT_DEFAULT_DATE_FORMAT),
          interval: null,
        },
      });

      const tree = generateCategoriesStatisticsTree(data);

      setModel(
        model.set(
          'data',
          {
            tree,
            newCategories: newCategories.map((c) => tree.first(({ model: { name } }) => name === c.name).model),
          },
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

  if (model.data.newCategories.length === 0) {
    return null;
  }

  return (
    <TimeperiodStatisticsCard
      className="card--hover-expand"
      header={`New ${config.transactionType} categories`}
      isLoading={isLoading}
    >
      <Table borderless size="sm">
        <tbody>
          {model.data.newCategories.map(({ name, icon, total }) => {
            const percentage = amountInPercentage(model.data.tree.model.total, total);

            return (
              <tr key={name}>
                <td>
                  <i aria-hidden className={icon} />
                </td>
                <td>
                  {name}
                  {': '}
                  <MoneyValue bold amount={total} maximumFractionDigits={total > 1 ? 0 : 2} />
                </td>
                <td>
                  <small className="d-block font-style-numeric">
                    {percentage === 0 && '0'}
                    {percentage !== 0 && percentage.toFixed(percentage > 1 ? 0 : 1)}
                    %
                  </small>
                  <Progress striped color="danger" value={percentage} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TimeperiodStatisticsCard>
  );
};

NewCategoriesCard.defaultProps = {
  config: DEFAULT_CONFIG,
  updateStatisticsTrigger: false,
};

NewCategoriesCard.propTypes = {
  fetchStatistics: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    transactionType: PropTypes.oneOf([EXPENSE_TYPE, INCOME_TYPE]),
    path: PropTypes.string,
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  updateStatisticsTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = ({ ui }) => ({
  updateStatisticsTrigger: ui.updateStatisticsTrigger,
});

export default connect(mapStateToProps, { fetchStatistics })(NewCategoriesCard);
