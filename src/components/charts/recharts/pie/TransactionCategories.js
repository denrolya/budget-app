import React, { useMemo, useState, useEffect } from 'react';
import { Card } from 'reactstrap';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';

import { amountInPercentage, expenseRatioColor } from 'src/services/common';
import MoneyValue from 'src/components/MoneyValue';
import {
  ACCOUNT_TYPE_BANK_CARD,
  ACCOUNT_TYPE_BASIC,
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_INTERNET,
} from 'src/constants/account';
import { HEX_COLORS } from 'src/constants/charts';

const CustomTooltip = ({ active, payload }) => {
  if (!active) {
    return null;
  }

  const {
    previous, total, name, icon,
  } = payload[0].payload;
  const color = expenseRatioColor(amountInPercentage(previous, total, 0));

  return (
    <Card body>
      <h5
        className="mb-1"
        style={{
          color: HEX_COLORS[color],
        }}
      >
        <i aria-hidden className={icon} />
        {' '}
        {name}
      </h5>
      <p className="mb-0 text-white">
        Selected Period:
        {' '}
        <MoneyValue bold amount={total} maximumFractionDigits={0} />
      </p>
      <p className="mb-0 text-white">
        Previous Period:
        {' '}
        <MoneyValue bold amount={previous} maximumFractionDigits={0} />
      </p>
    </Card>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool.isRequired,
  payload: PropTypes.array.isRequired,
};

const AccountDistribution = ({ data, selectedCategory, onClick }) => {
  const total = useMemo(() => sumBy(data, 'value'), [data]);
  const [chartData, setChartData] = useState([]);
  const onSectorEnter = (_, index) => setActive(index);
  const [active, setActive] = useState();

  useEffect(() => {
    const selectedSubtree = data.first(({ model: { name } }) => name === selectedCategory);
    setChartData(
      selectedSubtree.children.map((node) => node.model).reverse(),
    );
  }, [data, selectedCategory]);

  return (
    <ResponsiveContainer width="100%" height={window.isMobile ? 300 : '100%'}>
      <PieChart
        margin={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Pie
          clockwise
          data={chartData}
          labelLine={false}
          outerRadius="100%"
          innerRadius="70%"
          startAngle={90}
          endAngle={450}
          dataKey="total"
          onClick={({ name }) => onClick(name)}
          onMouseEnter={onSectorEnter}
          onMouseLeave={() => setActive()}
        >
          {chartData.map(({ name, total, previous }, index) => {
            const color = expenseRatioColor(amountInPercentage(previous, total, 0));

            return (
              <Cell
                key={`account-${name}`}
                stroke={HEX_COLORS[color]}
                strokeWidth={active === index ? 4 : 2}
                fill={`${HEX_COLORS[color]}${active === index ? '33' : '11'}`}
              />
            );
          })}
        </Pie>

        <Pie
          data={chartData}
          labelLine={false}
          outerRadius="67%"
          innerRadius="40%"
          startAngle={90}
          endAngle={450}
          dataKey="previous"
          onClick={({ name }) => onClick(name)}
          onMouseEnter={onSectorEnter}
          onMouseLeave={() => setActive()}
        >
          {chartData.map(({ name, total, previous }, index) => {
            const color = expenseRatioColor(amountInPercentage(previous, total, 0));

            return (
              <Cell
                key={`account-${name}`}
                stroke={`${HEX_COLORS[color]}33`}
                strokeWidth={active === index ? 4 : 2}
                fill={`${HEX_COLORS[color]}${active === index ? '33' : '11'}`}
              />
            );
          })}
        </Pie>
        <Tooltip content={<CustomTooltip total={total} />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

AccountDistribution.defaultProps = {};

AccountDistribution.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    account: PropTypes.shape({
      type: PropTypes.oneOf([ACCOUNT_TYPE_BANK_CARD, ACCOUNT_TYPE_INTERNET, ACCOUNT_TYPE_CASH, ACCOUNT_TYPE_BASIC])
        .isRequired,
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
      color: PropTypes.string,
      balance: PropTypes.number,
      values: PropTypes.object,
    }).isRequired,
    amount: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  onClick: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
};

export default AccountDistribution;
