import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';
import React, { useMemo } from 'react';
import { Card } from 'reactstrap';
import PropTypes from 'prop-types';
import {
  Radar,
  RadarChart,
  ResponsiveContainer,
  PolarGrid,
  Tooltip,
  PolarRadiusAxis,
  PolarAngleAxis,
  Cell,
} from 'recharts';

import MoneyValue from 'src/components/MoneyValue';
import { HEX_COLORS } from 'src/constants/charts';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const CustomTooltip = ({ active, payload }) => {
  if (!active) {
    return null;
  }

  return (
    <Card body className="px-3 py-2">
      <h5
        className="mb-1"
        style={{
          color: payload[0].payload.account.color,
        }}
      >
        {payload[0].payload.account.name}
      </h5>
      <p className="mb-0 text-white">
        <MoneyValue
          bold
          currency={payload[0].payload.account.currency}
          amount={payload[0].payload.amount}
          maximumFractionDigits={0}
        />
      </p>
    </Card>
  );
};

const AccountsExpenseDistribution = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
      <PolarGrid stroke={HEX_COLORS.text} />
      <PolarAngleAxis dataKey="account.name" stroke={HEX_COLORS.text} />
      <PolarRadiusAxis stroke={HEX_COLORS.text} tickCount={2} />
      <Radar name="test" dataKey="value" fillOpacity={0.6} stroke={HEX_COLORS.primary} fill={HEX_COLORS.primary} />
      <Tooltip content={CustomTooltip} />
    </RadarChart>
  </ResponsiveContainer>
);

AccountsExpenseDistribution.defaultProps = {
  data: [],
};

AccountsExpenseDistribution.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      account: PropTypes.shape({}).isRequired,
      value: PropTypes.number.isRequired,
      amount: PropTypes.number.isRequired,
    }),
  ),
};

export default AccountsExpenseDistribution;
