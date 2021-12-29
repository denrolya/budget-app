import TransactionDate from 'src/components/TransactionDate';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Table, UncontrolledTooltip } from 'reactstrap';
import AccountName from 'src/components/AccountName';

const TransfersTable = ({ data, deleteTransfer }) => (
  <div className="table-full-width table-responsive">
    <Table responsive>
      <tbody>
        {data.map((transfer) => (
          <tr key={transfer.id}>
            <td className="fit text-nowrap d-none d-md-table-cell">
              <code className="mr-2">
                #
                {transfer.id}
              </code>
            </td>
            <td id={`transfer-desc-${transfer.id}`}>
              <span className="d-block">
                <strong className="text-nowrap">
                  From:
                  {' '}
                  <AccountName account={transfer.from} />
                  {' '}
                </strong>
                {transfer.note && (
                  <sup className="text-warning">
                    <i aria-hidden className="tim-icons icon-alert-circle-exc" />

                    <UncontrolledTooltip placement="left" target={`transfer-desc-${transfer.id}`}>
                      {transfer.note}
                    </UncontrolledTooltip>
                  </sup>
                )}
              </span>

              <span className="d-block">
                To:
                {' '}
                <AccountName account={transfer.to} />
              </span>

              <small className="text-muted">
                <TransactionDate date={transfer.executedAt} />
              </small>
            </td>

            <td id={`transfer-rate-${transfer.id}`} className="text-right">
              <span className="text-currency">
                <strong className="d-block">
                  {transfer.from.currency.symbol}
                  {' '}
                  {transfer.amount}
                </strong>

                <var className="d-block">
                  <small>x</small>
                  {transfer.rate}
                </var>

                <small className="text-muted">
                  {transfer.feeExpense && (
                    <span className="text-warning">
                      {transfer.feeExpense.account.currency.symbol}
                      {' '}
                      {transfer.feeExpense.amount}
                      {' '}
                      fee paid from
                      {' '}
                      {transfer.feeExpense.account.name}
                    </span>
                  )}
                  {!transfer.feeExpense && <span>No fee</span>}
                </small>
              </span>
            </td>
            <td className="w-50px text-right">
              <Button size="sm" color="danger" className="btn-link" onClick={() => deleteTransfer(transfer)}>
                <i className="tim-icons icon-trash-simple" aria-hidden />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

TransfersTable.propTypes = {
  data: PropTypes.instanceOf(Immutable.List).isRequired,
  deleteTransfer: PropTypes.func.isRequired,
};

export default TransfersTable;
