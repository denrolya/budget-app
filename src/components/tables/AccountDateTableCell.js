import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

import { MOMENT_VIEW_DATE_FORMAT, MOMENT_VIEW_TIME_FORMAT } from 'src/constants/datetime';
import { isMoreThanHourAgo } from 'src/services/common';
import accountType from 'src/types/account';

const AccountDateTableCell = ({
  id, account, date, note,
}) => {
  const momentDate = moment(date);

  return (
    <td className="text-nowrap cursor-info">
      <strong className="d-block" id={`transaction-account-cell-${id}`}>
        {account.name}
        {' '}
        {'  '}
        {note && (
          <sup>
            <i className="text-warning tim-icons icon-notes" />
            <UncontrolledTooltip placement="right" target={`transaction-account-cell-${id}`}>
              {note}
            </UncontrolledTooltip>
          </sup>
        )}
      </strong>
      <small className="text-muted">
        {isMoreThanHourAgo(momentDate) ? momentDate.format(MOMENT_VIEW_DATE_FORMAT) : momentDate.fromNow()}
        {' '}
        <i aria-hidden className="tim-icons icon-time-alarm" />
        {' '}
        {momentDate.format(MOMENT_VIEW_TIME_FORMAT)}
      </small>
    </td>
  );
};

AccountDateTableCell.defaultProps = {
  note: '',
};

AccountDateTableCell.propTypes = {
  account: accountType.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  note: PropTypes.string,
};

export default AccountDateTableCell;
