import React, { memo, useMemo } from 'react';
import cn from 'classnames';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button,
  Table,
  ListGroup,
  ListGroupItem,
  UncontrolledTooltip,
} from 'reactstrap';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import {
  amountInPercentage,
  arrowIcon,
  expenseRatioColor,
  ratio,
} from 'src/utils/common';
import { generateLinkToExpenses } from 'src/utils/routing';
import { HEX_COLORS } from 'src/constants/color';

const CategoriesList = ({
  data,
  selectedCategory,
  onCategorySelect,
  after,
  before,
}) => {
  const selectedSubtree = data.first(({ model: { name } }) => name === selectedCategory);

  const previousPeriodToCurrentRatio = useMemo(() => {
    // TODO: I need a model here. model can generate previous period and that's what i need to calculate percentage
    const currentDayNumber = moment().dayOfYear();
    const lastDayOfYear = moment().endOf('year');
    const isCurrentYear = before.isSame(lastDayOfYear, 'year');
    const isNotEndOfYear = before.isSameOrBefore(lastDayOfYear);

    return (isCurrentYear && isNotEndOfYear)
      ? amountInPercentage(data.model.previous, (data.model.total / currentDayNumber) * 365, 0)
      : amountInPercentage(data.model.previous, data.model.total, 0);
  }, [data.model.previous, data.model.total]);

  const percentageFromTotal = useMemo(() => amountInPercentage(data.model.total, selectedSubtree.model.total), [
    data.model.total,
    selectedSubtree?.model.total,
  ]);

  return (
    <>
      <ListGroup flush className="card-category-tree__list">
        {selectedSubtree.children.map(({
          model: {
            id, name, icon, total, previous,
          },
        }, key) => {
          const amountToPreviousPeriodRatio = amountInPercentage(previous, total, 0);
          const percentageInTotalSum = amountInPercentage(data.model.total, total, 2);
          const toPreviousRatioColor = expenseRatioColor(amountToPreviousPeriodRatio);
          const isTotalAndPreviousZero = total === 0 && previous === 0;

          const rotation = key !== 0
            ? selectedSubtree.children
              .slice(0, key)
              .reduce((acc, el) => acc + amountInPercentage(selectedSubtree.model.total, el.model.total, 2) / 100, 1)
            : 1;

          return (
            <ListGroupItem className="p-1 card-category-tree__list-item" key={name}>
              <div className="d-flex justify-content-between align-center">
                <div className="font-weight-light cursor-info py-1" id={`category-${id}`}>
                  <span className="w-25px mr-2 d-inline-block align-center">
                    <CircularProgressbarWithChildren
                      styles={buildStyles({
                        rotation,
                        pathColor: `${HEX_COLORS[toPreviousRatioColor]}`,
                        trailColor: 'transparent',
                      })}
                      value={percentageInTotalSum}
                    >
                      <i
                        aria-hidden
                        className={cn(icon, 'text-white', {
                          'font-12px': isTotalAndPreviousZero,
                          'font-17px': !isTotalAndPreviousZero,
                        })}
                      />
                    </CircularProgressbarWithChildren>
                  </span>
                  {'  '}
                  <strong>{name === selectedCategory ? 'Uncategorized' : name}</strong>
                </div>
                <div className="text-nowrap card-category-tree__list-item-actions">
                  <small id={`category-${id}-to-previous`} className="font-style-numeric cursor-info">
                    {amountToPreviousPeriodRatio !== false && (
                      <span className={cn('mr-2', `text-${toPreviousRatioColor}`)}>
                        <i aria-hidden className={cn(arrowIcon(amountToPreviousPeriodRatio))} />
                        {` ${ratio(amountToPreviousPeriodRatio)}%`}
                      </span>
                    )}
                  </small>
                  <MoneyValue
                    bold
                    maximumFractionDigits={0}
                    className="mr-1 text-white cursor-info"
                    id={`category-${id}-amount`}
                    amount={total}
                  />
                  <div className="d-inline-block">
                    <Link
                      to={generateLinkToExpenses(
                        after.format(MOMENT_DATE_FORMAT),
                        before.format(MOMENT_DATE_FORMAT),
                        [],
                        [id],
                      )}
                    >
                      <Button size="sm" color="info" className="btn-link btn-icon btn-simple m-0">
                        <i aria-hidden className="mdi mdi-format-list-bulleted" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      color="primary"
                      className="btn-link btn-icon btn-simple m-0"
                      onClick={() => onCategorySelect(name)}
                    >
                      <i aria-hidden className="ion-ios-arrow-dropright" />
                    </Button>
                  </div>
                </div>
              </div>
              <UncontrolledTooltip target={`category-${id}`}>
                {percentageInTotalSum.toFixed()}
                % from total expenses
              </UncontrolledTooltip>
              <UncontrolledTooltip target={`category-${id}-to-previous`}>
                <MoneyValue maximumFractionDigits={0} amount={previous} />
              </UncontrolledTooltip>
              <UncontrolledTooltip target={`category-${id}-amount`}>
                <Table size="sm" bordered={false}>
                  <tbody>
                    {[
                      ['days', 'Daily'],
                      ['weeks', 'Weekly'],
                      ['months', 'Monthly'],
                      ['years', 'Annual'],
                    ].map(([unitOfTime, title]) => {
                      const diff = moment().isBetween(after, before)
                        ? moment().diff(after, unitOfTime) + 1
                        : before.diff(after, unitOfTime) + 1;

                      return (diff > 1) && (
                        <tr key={`${title}-expenses`}>
                          <td className="text-left">
                            {title}
                            {' '}
                            expense:
                          </td>
                          <td className="text-right">
                            <MoneyValue bold amount={total / diff} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </UncontrolledTooltip>
            </ListGroupItem>
          );
        })}
      </ListGroup>

      <ListGroup flush className="border-top-0">
        <ListGroupItem className="p-1 border-top-0">
          <div className="d-flex justify-content-between align-center font-weight-light">
            <Link
              id="expense-category-total"
              className="align-center"
              to={generateLinkToExpenses(after.format(MOMENT_DATE_FORMAT), before.format(MOMENT_DATE_FORMAT))}
            >
              <span
                className={cn(
                  'w-25px',
                  'mr-2',
                  'd-inline-block',
                  'text-center',
                  `text-${expenseRatioColor(previousPeriodToCurrentRatio)}`,
                )}
              >
                {!selectedSubtree.isRoot() && (
                  <CircularProgressbarWithChildren
                    styles={buildStyles({
                      pathColor: `${HEX_COLORS[expenseRatioColor(percentageFromTotal)]}`,
                      trailColor: 'transparent',
                    })}
                    value={percentageFromTotal}
                  >
                    <i
                      aria-hidden
                      className={cn({
                        'ion-ios-paper': selectedSubtree.model.name === data.model.name,
                        [selectedSubtree.model.icon]: selectedSubtree.model.name !== data.model.name,
                      })}
                    />
                  </CircularProgressbarWithChildren>
                )}

                {selectedSubtree.isRoot() && (
                  <i
                    aria-hidden
                    className={cn('font-22px', {
                      'ion-ios-paper': selectedSubtree.model.name === data.model.name,
                      [selectedSubtree.model.icon]: selectedSubtree.model.name !== data.model.name,
                    })}
                  />
                )}
              </span>
              <strong>{selectedSubtree.model.name === data.model.name ? 'Total' : selectedSubtree.model.name}</strong>
            </Link>

            <div className="text-nowrap text-right">
              {(previousPeriodToCurrentRatio !== false && previousPeriodToCurrentRatio !== 100) && (
                <small id="total-to-previous" className={`mr-2 text-${expenseRatioColor(previousPeriodToCurrentRatio)}`}>
                  <i aria-hidden className={cn(arrowIcon(previousPeriodToCurrentRatio))} />
                  {` ${ratio(previousPeriodToCurrentRatio)}%`}
                </small>
              )}
              <MoneyValue bold className="text-white" amount={selectedSubtree.model.total} />

              <UncontrolledTooltip target="total-to-previous">
                <MoneyValue bold maximumFractionDigits={0} amount={selectedSubtree.model.previous} />
              </UncontrolledTooltip>
            </div>
          </div>
        </ListGroupItem>
      </ListGroup>
      {!selectedSubtree.isRoot() && (
        <UncontrolledTooltip target="expense-category-total">
          {percentageFromTotal.toFixed()}
          % from total expenses
        </UncontrolledTooltip>
      )}
    </>
  );
};

CategoriesList.defaultProps = {};

CategoriesList.propTypes = {
  data: PropTypes.object.isRequired,
  after: PropTypes.object.isRequired,
  before: PropTypes.object.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
};

export default memo(
  CategoriesList,
  (pp, np) => isEqual(pp.selectedCategory, np.selectedCategory)
    && isEqual(pp.data, np.data)
    && isEqual(pp.after, np.after)
    && isEqual(pp.before, np.before),
);
