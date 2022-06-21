import React, { useMemo, useState } from 'react';
import { Card } from 'reactstrap';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';

import { amountInPercentage } from 'src/utils/common';
import AccountName from 'src/components/AccountName';
import MoneyValue from 'src/components/MoneyValue';
import {
  ACCOUNT_TYPE_BANK_CARD,
  ACCOUNT_TYPE_BASIC,
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_INTERNET,
} from 'src/constants/account';

const AccountDistribution = ({ data, height }) => {
  const onSectorEnter = (_, index) => setActive(index);
  const [active, setActive] = useState();

  const total = useMemo(() => sumBy(data, 'value'), [data]);

  const tooltipFormatter = ({ active, payload }) => {
    if (!active || !payload?.length) {
      return null;
    }

    const { account, amount, value } = payload[0].payload;

    return (
      <Card body className="px-3 py-2">
        <h4
          className="mb-1"
          style={{
            color: account.color,
          }}
        >
          <AccountName account={account} />
        </h4>
        <p className="mb-0 text-white">
          <MoneyValue bold currency={account.currency} amount={amount} maximumFractionDigits={0} />
        </p>
        <p className="mb-0">
          <span className="font-weight-bold font-style-numeric">
            {amountInPercentage(total, value, 0)}
            %
          </span>
          {' '}
          from total
        </p>
      </Card>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart
        margin={{
          top: 0, left: 0, right: 0, bottom: 0,
        }}
      >
        <defs>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" />
          </filter>
        </defs>
        <Pie
          labelLine={false}
          outerRadius={140}
          startAngle={90}
          endAngle={450}
          dataKey="value"
          data={data}
          onMouseEnter={onSectorEnter}
          onMouseLeave={() => setActive()}
        >
          {data.map(({ account }, index) => (
            <Cell
              filter="url(#shadow)"
              key={`account-${account.id}`}
              stroke={account.color}
              strokeWidth={2}
              fill={`${account.color}${active === index ? '33' : '11'}`}
            />
          ))}
        </Pie>
        <Tooltip content={tooltipFormatter} />
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
