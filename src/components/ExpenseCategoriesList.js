import React, { memo, useMemo } from 'react';
import cn from 'classnames';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Progress,
  Button,
  Table,
  UncontrolledCollapse,
  ListGroup,
  ListGroupItem,
  UncontrolledTooltip,
} from 'reactstrap';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import {
  amountInPercentage, arrowIcon, expenseRatioColor, ratio,
} from 'src/services/common';
import { generateLinkToExpenses } from 'src/services/routing';
import { HEX_COLORS } from 'src/constants/charts';

const ExpenseCategoriesList = ({
  data, selectedCategory, onCategorySelect, from, to,
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
      <div className="table-responsive" style={{ height: 575 }}>
        <ListGroup flush>
          {selectedSubtree.children.map(({
            model: {
              name, icon, total, previous,
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
                  <div className="btn-link text-white font-weight-light cursor-info" id={`expense-category-${key}`}>
                    <div className="w-25px mr-2 d-inline-block">
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
                          className={cn(icon, {
                            'font-12px': isTotalAndPreviousZero,
                            'font-15px': !isTotalAndPreviousZero,
                          })}
                        />
                      </CircularProgressbarWithChildren>
                    </div>
                    {'  '}
                    <strong>{name === selectedCategory ? 'Uncategorized' : name}</strong>
                  </div>
                  <div>
                    <MoneyValue className="mr-1" amount={total} maximumFractionDigits={0} />
                    <Link
                      to={generateLinkToExpenses(
                        from.format(MOMENT_DATE_FORMAT),
                        to.format(MOMENT_DATE_FORMAT),
                        [],
                        [name],
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
                <UncontrolledCollapse toggler={`expense-category-${key}`}>
                  <Table size="sm" bordered={false}>
                    <tbody>
                      {percentageInTotalSum !== false && (
                        <tr>
                          <td>From total expenses:</td>
                          <td className="text-right">
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
                          <td className="text-right">
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
                                <MoneyValue amount={total / diff} />
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
      </div>

      <Table size="sm" bordered={false}>
        <tbody>
          <tr>
            <td className="text-nowrap">
              <Link
                className="text-decoration-none d-flex align-items-center"
                to={generateLinkToExpenses(from.format(MOMENT_DATE_FORMAT), to.format(MOMENT_DATE_FORMAT))}
              >
                <div
                  className={cn(
                    'w-25px',
                    'mr-2',
                    'd-inline-block',
                    'text-center',
                    `text-${expenseRatioColor(previousPeriodToCurrentRatio)}`,
                  )}
                >
                  <i
                    aria-hidden
                    className={cn('font-22px', {
                      'ion-ios-paper': selectedSubtree.model.name === data.model.name,
                      [selectedSubtree.model.icon]: selectedSubtree.model.name !== data.model.name,
                    })}
                  />
                </div>
                {'   '}
                <strong>{selectedSubtree.model.name === data.model.name ? 'Total' : selectedSubtree.model.name}</strong>
              </Link>
            </td>
            <td className="text-right text-nowrap">
              <span className="text-white">
                <MoneyValue bold amount={selectedSubtree.model.total} />
              </span>
              {previousPeriodToCurrentRatio !== false && previousPeriodToCurrentRatio !== 100 && (
                <small
                  className={cn('cursor-info', 'd-block', `text-${expenseRatioColor(previousPeriodToCurrentRatio)}`)}
                >
                  <i aria-hidden className={cn(arrowIcon(previousPeriodToCurrentRatio))} />
                  {` ${ratio(previousPeriodToCurrentRatio)}% `}
                  <small>
                    {' | '}
                    <MoneyValue bold maximumFractionDigits={0} amount={selectedSubtree.model.previous} />
                  </small>
                </small>
              )}
            </td>
          </tr>
          {!selectedSubtree.isRoot() && (
            <tr>
              <td colSpan={2} className="border-top-0 px-0">
                <div className="mb-1 opacity-7">
                  <Progress
                    id="percentageFromTotal"
                    value={percentageFromTotal}
                    color={expenseRatioColor(percentageFromTotal)}
                  />
                  <UncontrolledTooltip target="percentageFromTotal">
                    {percentageFromTotal.toFixed()}
                    % from total expenses
                  </UncontrolledTooltip>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
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
