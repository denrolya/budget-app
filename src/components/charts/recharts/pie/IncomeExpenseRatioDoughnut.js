import React, { useState, useEffect } from 'react';
import sumBy from 'lodash/sumBy';
import cn from 'classnames';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
} from 'recharts';

import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import { HEX_COLORS } from 'src/constants/color';
import { amountInPercentage, ratio } from 'src/utils/common';

const IncomeExpenseRatioDoughnut = ({ height, data, previousPeriod }) => {
  const [chartData, setChartData] = useState([{
    type: INCOME_TYPE,
    value: 0,
  }, {
    type: EXPENSE_TYPE,
    value: 0,
  }]);
  const { symbol } = useBaseCurrency();
  const [active, setActive] = useState(0);
  const onSectorEnter = (_, index) => setActive(index);

  useEffect(() => {
    setChartData([{
      type: INCOME_TYPE,
      value: sumBy(data.selectedPeriod, INCOME_TYPE),
    }, {
      type: EXPENSE_TYPE,
      value: Math.abs(sumBy(data.selectedPeriod, EXPENSE_TYPE)),
    }]);
  }, [data]);

  const renderActiveShape = ({
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    type,
  }) => {
    const fill = type === INCOME_TYPE ? HEX_COLORS.success : HEX_COLORS.danger;

    const diff = sumBy(data.selectedPeriod, INCOME_TYPE) - Math.abs(sumBy(data.selectedPeriod, EXPENSE_TYPE));
    const previousPeriodDiff = previousPeriod ? sumBy(data.previousPeriod, INCOME_TYPE) - Math.abs(sumBy(data.previousPeriod, EXPENSE_TYPE)) : undefined;
    const selectedAndPreviousPeriodDiffRatio = amountInPercentage(previousPeriodDiff, diff, 0);

    return (
      <g>
        <text
          dy={5}
          dx={-5}
          fontSize="26"
          textAnchor="middle"
          fontFamily="'Roboto Condensed', sans-serif"
          fill={HEX_COLORS.white}
          x={cx}
          y={cy}
        >
          {symbol}
          {' '}
          {diff.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </text>
        {previousPeriod && (
          <text
            fontSize="14"
            textAnchor="middle"
            dy={30}
            x={cx}
            y={cy}
            fill={selectedAndPreviousPeriodDiffRatio <= 0 ? HEX_COLORS.danger : HEX_COLORS.success}
          >
            {`${ratio(selectedAndPreviousPeriodDiffRatio)}%`}
          </text>
        )}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" />
          </filter>
        </defs>
        <Pie
          clockwise
          filter="url(#shadow)"
          stroke="none"
          cx="50%"
          cy="50%"
          innerRadius="75%"
          outerRadius="90%"
          dataKey="value"
          startAngle={270}
          endAngle={-270}
          paddingAngle={5}
          activeIndex={active}
          data={chartData}
          symbol={symbol}
          activeShape={renderActiveShape}
          onMouseEnter={onSectorEnter}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

IncomeExpenseRatioDoughnut.defaultProps = {
  height: 250,
  previousPeriod: false,
};

IncomeExpenseRatioDoughnut.propTypes = {
  data: PropTypes.shape({
    selectedPeriod: PropTypes.arrayOf(PropTypes.shape({
      after: PropTypes.number.isRequired,
      before: PropTypes.number.isRequired,
      expense: PropTypes.number.isRequired,
      income: PropTypes.number.isRequired,
    })).isRequired,
    previousPeriod: PropTypes.arrayOf(PropTypes.shape({
      after: PropTypes.number.isRequired,
      before: PropTypes.number.isRequired,
      expense: PropTypes.number.isRequired,
      income: PropTypes.number.isRequired,
    })),
  }).isRequired,
  previousPeriod: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default IncomeExpenseRatioDoughnut;
