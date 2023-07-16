import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';
import cn from 'classnames';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { MOMENT_VIEW_DATE_WITH_YEAR_FORMAT } from 'src/constants/datetime';
import MoneyValue from 'src/components/MoneyValue';
import { CURRENCIES } from 'src/constants/currency';
import { HEX_COLORS } from 'src/constants/color';

const AccountBalance = ({ account }) => {
  const yAxisTickFormatter = (val) => `${CURRENCIES[account.currency].symbol} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const tooltipFormatter = ({ active, payload }) => (active && payload?.length) && (
    <Card body className="px-3 py-2">
      <h4 className="mb-1 text-white">
        <i aria-hidden className="ion-ios-calendar" />
        {' '}
        {payload[0].payload.createdAt.format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}
      </h4>
      <p
        className={cn('mb-0', {
          'text-success': payload[0].value >= 0,
          'text-danger': payload[0].value < 0,
        })}
      >
        <MoneyValue bold maximumFractionDigits={0} amount={payload[0].value} currency={account.currency} />
      </p>
    </Card>
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={account.logs}>
        <defs>
          <linearGradient id={`${account.id}-gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopOpacity={0.4} stopColor={HEX_COLORS.success} />
            <stop offset="75%" stopOpacity={0.2} stopColor={`${HEX_COLORS.success}11`} />
          </linearGradient>
        </defs>

        <Area
          type="monotone"
          dot={false}
          stroke={HEX_COLORS.success}
          dataKey={`convertedValues.${account.currency}`}
          fill={`url(#${account.id}-gradient)`}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9 }}
          width={40}
          stroke={HEX_COLORS.text}
          dataKey={`convertedValues.${account.currency}`}
          tickFormatter={yAxisTickFormatter}
        />
        <XAxis hide dataKey="createdAt" axisLine={false} tickLine={false} stroke={HEX_COLORS.text} />

        <CartesianGrid opacity={0.1} vertical={false} stroke={HEX_COLORS.text} />

        <Tooltip content={tooltipFormatter} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

AccountBalance.propTypes = {
  account: PropTypes.shape({
    currency: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    logs: PropTypes.arrayOf(
      PropTypes.shape({
        createdAt: PropTypes.object.isRequired,
        convertedValues: PropTypes.object.isRequired,
      }),
    ),
    color: PropTypes.string.isRequired,
  }).isRequired,
};

export default AccountBalance;
