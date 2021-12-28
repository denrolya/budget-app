import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import React from 'react';
import { Badge } from 'reactstrap';
import Swal from 'sweetalert2';

import { MOMENT_VIEW_TIME_FORMAT, SERVER_TIMEZONE } from 'src/constants/datetime';

/**
 * Shows cancellation confirmation alert
 *
 * @param {Object} account
 * @param {number} amount
 * @param {string} type
 * @returns {Promise<SweetAlertResult>}
 */
export const confirmTransactionCancellation = ({ account, amount, type }) =>
  Swal.fire({
    title: 'Cancel Transaction',
    text: `Are you sure you want to delete this ${type}?(${account.currency.symbol} ${amount})`,
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel this transaction',
    cancelButtonText: 'No, keep it',
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-success',
    reverseButtons: true,
    buttonsStyling: false,
  });

/**
 * Shows deletion confirmation alert
 *
 * @param {Object} account
 * @param {number} amount
 * @param {string} type
 * @returns {Promise<SweetAlertResult>}
 */
export const confirmTransactionDeletion = ({ account, amount, type }) =>
  Swal.fire({
    title: 'Irrevocably DELETE',
    text: `Are you sure you want to delete this ${type} FOREVER?(${account.currency.symbol} ${amount})`,
    showCancelButton: true,
    confirmButtonText: 'DELETE',
    cancelButtonText: 'OMG, no',
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-success',
    reverseButtons: true,
    buttonsStyling: false,
  });

/**
 * Shows removal alert
 *
 * @param {number} id
 * @param {name} name
 * @returns {Promise<"sweetalert2".SweetAlertResult>}
 */
export const confirmCategoryRemoval = ({ id, name }) =>
  Swal.fire({
    title: 'Remove category',
    text: `Are you sure you want to completely remove category '${name}'? This involves transaction deletion, for all users!!!`,
    showCancelButton: true,
    confirmButtonText: 'Yes, remove category & transactions!',
    cancelButtonText: 'Cancel',
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-success',
    reverseButtons: true,
    buttonsStyling: false,
  });

/**
 *
 * @param {Array} categories
 * @returns {Array}
 */
export const createCategoriesTree = (categories) =>
  orderBy(
    categories.map((c) => {
      if (c.children.length > 0) {
        c.children = createCategoriesTree(c.children);
      }

      return {
        ...c,
        title: (
          <span title={c.name}>
            <i className={c.icon} aria-hidden style={{ fontSize: '18px' }} />
            {'  '}
            <code>#{c.id}</code> {c.name + (c.children.length > 0 ? `(${c.children.length})` : '')}
            {c.isFixed && (
              <Badge pill color="warning" className="ml-1" size="sm">
                F
              </Badge>
            )}
          </span>
        ),
        subtitle: (
          <p className="mt-2">
            {c.tags.map(({ name }) => (
              <a href="#" className="mr-1 font-weight-bold" key={name}>
                #{name}
              </a>
            ))}
          </p>
        ),
      };
    }),
    ({ children }) => children.length,
    'desc',
  );

/**
 * Formats transaction into backend-suitable shape
 *
 * @returns {{executedAt: *, note: *, amount: *, id: *, category: *, account: *}}
 */
export const formatTransactionToFormType = ({
  amount,
  account,
  category,
  note,
  executedAt,
  compensations,
  isDraft,
}) => ({
  amount,
  note,
  isDraft,
  account: account.id,
  category: category.name,
  executedAt: moment(executedAt).tz(SERVER_TIMEZONE).format(),
  ...(compensations && {
    compensations: compensations.map(formatTransactionToFormType),
  }),
});

/**
 * Formats transfer object into backend-suitable shape
 *
 * @param {number} id
 * @param {Object} from
 * @param {Object} to
 * @param {number} amount
 * @param {number} rate
 * @param {float} fee
 * @param {Object} feeAccount
 * @param {string} executedAt
 * @param {string} note
 * @returns {{executedAt: *, note: *, amount: *, feeAccount: *, rate: *, fee: *, from: *, id: *, to: *}}
 */
export const formatTransferToFormType = ({ id, from, to, amount, rate, fee, feeAccount, executedAt, note }) => ({
  id,
  amount,
  note,
  fee,
  rate,
  from: from.id,
  to: to.id,
  feeAccount: feeAccount ? feeAccount.id : feeAccount,
  executedAt: moment(executedAt).tz(SERVER_TIMEZONE).format(),
});

/**
 * @param {array} transactions
 * @returns {array}
 */
export const initializeList = (transactions) =>
  transactions.map(({ executedAt, canceledAt, ...rest }) => ({
    ...rest,
    executedAt: moment(executedAt),
    executionTime: moment(executedAt).format(MOMENT_VIEW_TIME_FORMAT),
    canceledAt: canceledAt ? moment(canceledAt) : null,
  }));
