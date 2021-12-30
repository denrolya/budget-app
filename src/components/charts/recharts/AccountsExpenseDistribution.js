import isEqual from 'lodash/isEqual';
import React, { memo, useMemo } from 'react';
import { Card } from 'reactstrap';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';

import { amountInPercentage } from 'src/services/common';
import AccountName from 'src/components/AccountName';
import MoneyValue from 'src/components/MoneyValue';
import {
  ACCOUNT_TYPE_BANK_CARD,
  ACCOUNT_TYPE_BASIC,
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_INTERNET,
} from 'src/constants/account';

const CustomTooltip = ({ active, payload, total }) => {
  if (!active) {
    return null;
  }

  const { account, amount, value } = payload[0].payload;

  return (
    <Card body>
      <h5
        className="mb-1"
        style={{
          color: account.color,
        }}
      >
        <AccountName account={account} />
      </h5>
      <p className="mb-0 text-white">
        <MoneyValue bold currency={account.currency} amount={amount} maximumFractionDigits={0} />
      </p>
      <p className="mb-0">
        <span className="font-weight-bold">
          {amountInPercentage(total, value, 0)}
          %
        </span>
        {' '}
        from total
      </p>
    </Card>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool.isRequired,
  payload: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

const AccountDistribution = ({ data, height }) => {
  const total = useMemo(() => sumBy(data, 'value'), [data]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart
        margin={{
          top: 0, left: 0, right: 0, bottom: 0,
        }}
      >
        <Pie
          data={data}
          labelLine={false}
          outerRadius={140}
          startAngle={90}
          endAngle={450}
          dataKey="value"
        >
          {data.map(({ account }) => (
            <Cell key={`account-${account.id}`} stroke={account.color} strokeWidth={2} fill={`${account.color}33`} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip total={total} />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

AccountDistribution.defaultProps = {
  height: 300,
};

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
  height: PropTypes.number,
};

export default AccountDistribution;
