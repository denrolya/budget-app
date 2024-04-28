import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

import { randomString } from 'src/utils/randomData';
import MoneyValue from 'src/components/MoneyValue';

const AccountName = ({
  colored,
  account: {
    name,
    color,
    balance,
    icon,
    convertedValues,
    currency,
    archivedAt,
  },
  showBalance,
  showIcon,
  showName,
}) => {
  const randomIdString = randomString(5);
  return (
    <>
      {showIcon && (
        <>
          <i
            aria-hidden
            id={`account-name-${randomIdString}`}
            style={{
              color: !archivedAt ? color : 'inherit',
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
            amount={balance}
            values={convertedValues}
            currency={currency}
            className={cn('font-size-larger', 'opacity-6', {
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
  showBalance: false,
  showIcon: true,
  showName: true,
};

AccountName.propTypes = {
  account: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    color: PropTypes.string,
    balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    convertedValues: PropTypes.object,
    archivedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  colored: PropTypes.bool,
  showBalance: PropTypes.bool,
  showIcon: PropTypes.bool,
  showName: PropTypes.bool,
};

export default AccountName;
