import React, { memo, useMemo } from 'react';
import cn from 'classnames';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Progress, Button, Table, UncontrolledTooltip } from 'reactstrap';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { amountInPercentage, arrowIcon, expenseRatioColor, ratio } from 'src/services/common';
import { generateLinkToExpenses } from 'src/services/routing';

const ExpenseCategoriesTable = ({
  data,
  selectedCategory,
  onCategorySelect,
  from,
  to,
  showDailyAnnual,
  showDailyMonthly,
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
      <div className="table-responsive" style={{ height: 400 }}>
        <Table size="sm" className="table--border-top-0">
          <tbody>
            {selectedSubtree.children.map(({ model: { name, icon, total, previous } }, key) => {
              const amountToPreviousPeriodRatio = amountInPercentage(previous, total, 0);
              const percentageInTotalSum = amountInPercentage(data.model.total, total, 2);
              const toPreviousRatioColor = expenseRatioColor(amountToPreviousPeriodRatio);
              const isTotalAndPreviousZero = total === 0 && previous === 0;

              return (
                <tr
                  key={name}
                  className={cn({
                    'opacity-6': isTotalAndPreviousZero,
                  })}
                >
                  <td className="text-nowrap p-0">
                    <Button className="btn-link text-white font-weight-light" onClick={() => onCategorySelect(name)}>
                      <div className="w-25px mr-2 d-inline-block text-center">
                        <CircularProgressbarWithChildren value={percentageInTotalSum}>
                          <i
                            className={cn(icon, {
                              'font-15px': isTotalAndPreviousZero,
                              'font-22px': !isTotalAndPreviousZero,
                            })}
                            aria-hidden
                          />
                        </CircularProgressbarWithChildren>
                      </div>
                      {'  '}
                      <strong>
                        {name === selectedCategory ? 'Uncategorized' : name}
                        {percentageInTotalSum !== false && (
                          <small className="opacity-6 text-primary">
                            {`  (${
                              percentageInTotalSum > 0 || percentageInTotalSum === 0
                                ? percentageInTotalSum.toFixed()
                                : percentageInTotalSum.toFixed(1)
                            }%)`}
                          </small>
                        )}
                      </strong>
                    </Button>
                  </td>
                  <td className="text-right text-nowrap p-0">
                    <span className="text-white">
                      <MoneyValue maximumFractionDigits={0} amount={total} />
                      {showDailyAnnual && (
                        <small id={`dailyExpense-${key}`} className="text-muted cursor-info">
                          {' | '}
                          <MoneyValue amount={total / moment().dayOfYear()} />
                          <UncontrolledTooltip target={`dailyExpense-${key}`}>
                            Daily expense in {name}:
                            <MoneyValue amount={total / moment().dayOfYear()} />
                          </UncontrolledTooltip>
                        </small>
                      )}
                    </span>
                  </td>
                  <td className="text-right text-nowrap w-25px">
                    <Button
                      size="sm"
                      color="warning"
                      className="btn-link btn-icon cursor-info btn-simple m-0"
                      id={`tooltip-${key}`}
                    >
                      <i className="ion-ios-information-circle-outline" aria-hidden />
                    </Button>
                    <UncontrolledTooltip target={`tooltip-${key}`}>
                      <dl>
                        {amountToPreviousPeriodRatio !== false && (
                          <>
                            <dt>Previous period:</dt>
                            <dd className="d-flex justify-content-between">
                              <MoneyValue maximumFractionDigits={0} amount={previous} />
                              <span className={cn(`text-${toPreviousRatioColor}`)}>
                                <i className={cn(arrowIcon(amountToPreviousPeriodRatio))} aria-hidden />{' '}
                                {ratio(amountToPreviousPeriodRatio)}%
                              </span>
                            </dd>
                          </>
                        )}
                        {showDailyAnnual && (
                          <>
                            <dt>Daily expense in {name}:</dt>
                            <dd>
                              <MoneyValue amount={total / moment().dayOfYear()} />
                            </dd>
                          </>
                        )}
                        {showDailyMonthly && (
                          <>
                            <dt>Daily expense in {name}:</dt>
                            <dd>
                              <MoneyValue amount={total / moment().date()} />
                            </dd>
                          </>
                        )}
                      </dl>
                    </UncontrolledTooltip>

                    <Link
                      to={generateLinkToExpenses(
                        from.format(MOMENT_DATE_FORMAT),
                        to.format(MOMENT_DATE_FORMAT),
                        [],
                        [name],
                      )}
                    >
                      <Button size="sm" color="info" className="btn-link btn-icon btn-simple m-0">
                        <i className="mdi mdi-format-list-bulleted" aria-hidden />
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <hr />

      <Table size="sm" bordered={false}>
        <tbody>
          <tr>
            <td className="text-nowrap">
              <Link
                className="text-decoration-none d-flex align-items-center"
                to={generateLinkToExpenses(from.format(MOMENT_DATE_FORMAT), to.format(MOMENT_DATE_FORMAT))}
              >
                <div
                  className={`w-25px mr-2 d-inline-block text-center text-${expenseRatioColor(
                    previousPeriodToCurrentRatio,
                  )}`}
                >
                  <i
                    className={cn('font-22px', {
                      'ion-ios-paper': selectedSubtree.model.name === data.model.name,
                      [selectedSubtree.model.icon]: selectedSubtree.model.name !== data.model.name,
                    })}
                    aria-hidden
                  />
                </div>
                {'   '}
                <strong>{selectedSubtree.model.name === data.model.name ? 'Total' : selectedSubtree.model.name}</strong>
              </Link>
            </td>
            <td className="text-right text-nowrap">
              <span className="text-white">
                <MoneyValue amount={selectedSubtree.model.total} />
              </span>
              {previousPeriodToCurrentRatio !== false && previousPeriodToCurrentRatio !== 100 && (
                <small
                  className={cn('cursor-info', 'd-block', `text-${expenseRatioColor(previousPeriodToCurrentRatio)}`)}
                >
                  <i className={cn(arrowIcon(previousPeriodToCurrentRatio))} aria-hidden />
                  {` ${ratio(previousPeriodToCurrentRatio)}% `}
                  <small>
                    {` | `}
                    <MoneyValue maximumFractionDigits={0} amount={selectedSubtree.model.previous} />
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
                    {percentageFromTotal.toFixed()}% from total expenses
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

ExpenseCategoriesTable.defaultProps = {
  showDailyAnnual: false,
  showDailyMonthly: false,
};

ExpenseCategoriesTable.propTypes = {
  data: PropTypes.object.isRequired,
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
  showDailyAnnual: PropTypes.bool,
  showDailyMonthly: PropTypes.bool,
};

export default memo(
  ExpenseCategoriesTable,
  (pp, np) =>
    isEqual(pp.selectedCategory, np.selectedCategory) &&
    isEqual(pp.data, np.data) &&
    isEqual(pp.from, np.from) &&
    isEqual(pp.to, np.to),
);
