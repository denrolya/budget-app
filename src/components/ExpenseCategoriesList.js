import React, { memo, useMemo } from 'react';
import cn from 'classnames';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button,
  Table,
  UncontrolledCollapse,
  ListGroup,
  ListGroupItem,
  UncontrolledTooltip,
} from 'reactstrap';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import Breadcrumbs from 'src/components/ExpenseCategoriesBreadcrumbs';
import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import {
  amountInPercentage, arrowIcon, expenseRatioColor, ratio,
} from 'src/utils/common';
import { generateLinkToExpenses } from 'src/utils/routing';
import { HEX_COLORS } from 'src/constants/color';

const ExpenseCategoriesList = ({
  data,
  selectedCategory,
  onCategorySelect,
  from,
  to,
}) => {
  const selectedSubtree = data.first(({ model: { name } }) => name === selectedCategory);

  const previousPeriodToCurrentRatio = useMemo(() => amountInPercentage(data.model.previous, data.model.total, 0), [
    data.model.previous,
    data.model.total,
  ]);

  const percentageFromTotal = useMemo(() => amountInPercentage(data.model.total, selectedSubtree.model.total), [
    data.model.total,
    selectedSubtree?.model.total,
  ]);

  return (
    <>
      <Breadcrumbs selectedCategory={selectedCategory} selectCategory={onCategorySelect} tree={data} />

      <ListGroup flush className="card-expense-categories__list">
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
            <ListGroupItem className="p-1" key={name}>
              <div className="d-flex justify-content-between align-center">
                <div className="font-weight-light cursor-info py-2" id={`expense-category-${key}`}>
                  <span className="w-25px mr-2 d-inline-block">
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
                <div className="text-nowrap">
                  <MoneyValue bold className="mr-1 text-white" amount={total} maximumFractionDigits={0} />
                  <span>
                    <Link
                      to={generateLinkToExpenses(
                        from.format(MOMENT_DATE_FORMAT),
                        to.format(MOMENT_DATE_FORMAT),
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
                  </span>
                </div>
              </div>
              <UncontrolledTooltip target={`expense-category-${key}`}>
                {percentageInTotalSum.toFixed()}
                % from total expenses
              </UncontrolledTooltip>
              <UncontrolledCollapse toggler={`expense-category-${key}`} className="pl-4">
                <Table size="sm" bordered={false}>
                  <tbody>
                    {percentageInTotalSum !== false && (
                      <tr>
                        <td>From total expenses:</td>
                        <td className="text-right font-style-numeric font-weight-bold">
                          {percentageInTotalSum > 0 || percentageInTotalSum === 0
                            ? percentageInTotalSum.toFixed()
                            : percentageInTotalSum.toFixed(1)}
                          %
                        </td>
                      </tr>
                    )}
                    {amountToPreviousPeriodRatio !== false && (
                      <tr>
                        <td>Previous period:</td>
                        <td className="text-right font-style-numeric font-weight-bold">
                          <span className={cn('mr-2', `text-${toPreviousRatioColor}`)}>
                            <i aria-hidden className={cn(arrowIcon(amountToPreviousPeriodRatio))} />
                            {' '}
                            {ratio(amountToPreviousPeriodRatio)}
                            %
                          </span>
                          <MoneyValue maximumFractionDigits={0} amount={previous} />
                        </td>
                      </tr>
                    )}
                    {[
                      ['days', 'Daily'],
                      ['weeks', 'Weekly'],
                      ['months', 'Monthly'],
                      ['years', 'Annual'],
                    ].map(([unitOfTime, title]) => {
                      const diff = moment().isBetween(from, to)
                        ? moment().diff(from, unitOfTime) + 1
                        : to.diff(from, unitOfTime) + 1;

                      return (
                        diff > 1 && (
                          <tr key={`${title}-expenses`}>
                            <td>
                              {title}
                              {' '}
                              expense:
                            </td>
                            <td className="text-right">
                              <MoneyValue bold amount={total / diff} />
                            </td>
                          </tr>
                        )
                      );
                    })}
                  </tbody>
                </Table>
              </UncontrolledCollapse>
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
              to={generateLinkToExpenses(from.format(MOMENT_DATE_FORMAT), to.format(MOMENT_DATE_FORMAT))}
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
            <div className="text-nowrap text-right d-flex flex-column">
              <MoneyValue bold className="text-white" amount={selectedSubtree.model.total} />
              {(previousPeriodToCurrentRatio !== false && previousPeriodToCurrentRatio !== 100) && (
                <small className={`text-${expenseRatioColor(previousPeriodToCurrentRatio)}`}>
                  <i aria-hidden className={cn(arrowIcon(previousPeriodToCurrentRatio))} />
                  {` ${ratio(previousPeriodToCurrentRatio)}% | `}
                  <MoneyValue bold maximumFractionDigits={0} amount={selectedSubtree.model.previous} />
                </small>
              )}
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

ExpenseCategoriesList.defaultProps = {};

ExpenseCategoriesList.propTypes = {
  data: PropTypes.object.isRequired,
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
};

export default memo(
  ExpenseCategoriesList,
  (pp, np) => isEqual(pp.selectedCategory, np.selectedCategory)
    && isEqual(pp.data, np.data)
    && isEqual(pp.from, np.from)
    && isEqual(pp.to, np.to),
);
