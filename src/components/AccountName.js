import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { UncontrolledTooltip } from 'reactstrap';

import { randomString } from 'src/utils/randomData';
import MoneyValue from 'src/components/MoneyValue';

const AccountName = ({
  colored,
  id,
  account: {
    name,
    color,
    balance,
    icon,
    convertedValues,
    currency,
    archivedAt,
    id: accountId,
  },
  showBalance,
  showIcon,
  showName,
}) => {
  const randomIdString = useMemo(() => `${id}-${randomString(5)}`, [accountId]);

  return (
    <>
      {showIcon && (
        <>
          <i
            aria-hidden
            id={`account-name-${randomIdString}`}
            style={{
              color: (!archivedAt && colored) ? color : 'inherit',
            }}
            className={cn(icon, {
              'cursor-info': !showName,
            })}
          />
          <UncontrolledTooltip target={`account-name-${randomIdString}`}>{name}</UncontrolledTooltip>
        </>
      )}
      {(!showBalance && showName) && ` ${name}`}
      {showBalance && (
        <div className="d-flex flex-column">
          <p className="text-nowrap">{name}</p>
          <MoneyValue
            bold
            amount={balance}
            values={convertedValues}
            currency={currency}
            className={cn('font-size-larger', 'opacity-8', {
              'text-danger': balance < 0,
              'text-success': balance > 0,
            })}
          />
        </div>
      )}
    </>
  );
};

AccountName.defaultProps = {
  colored: true,
  id: 'account-name',
  showBalance: false,
  showIcon: true,
  showName: true,
};

AccountName.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    color: PropTypes.string,
    balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    convertedValues: PropTypes.object,
    archivedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  id: PropTypes.string,
  colored: PropTypes.bool,
  showBalance: PropTypes.bool,
  showIcon: PropTypes.bool,
  showName: PropTypes.bool,
};

export default AccountName;
