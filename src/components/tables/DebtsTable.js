import cn from 'classnames';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button, FormGroup, Input, Label, UncontrolledCollapse, Table, UncontrolledTooltip,
} from 'reactstrap';

import TransactionRow from 'src/components/tables/TransactionRowDesktop';
import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';
import debtType from 'src/types/debt';

const DebtsTable = ({
  debts, toggleEdit, closeDebt, toggleDebtTransactionModal,
}) => {
  const { symbol } = useBaseCurrency();

  return debts.map((debt) => {
    const {
      id, debtor, balance, value, currency, createdAt, closedAt, transactions, note,
    } = debt;

    return (
      <>
        <div key={id} className="d-flex justify-content-between">
          <div className="w-50px">
            <FormGroup check>
              <Label check>
                <Input type="checkbox" onChange={() => closeDebt(debt)} />
                <span className="form-check-sign" />
              </Label>
            </FormGroup>
          </div>
          <div
            className={cn('w-130px', 'text-nowrap', {
              'opacity-6': !!closedAt,
            })}
          >
            <div
              id={`debt-${id}`}
              className={cn({
                'cursor-info': !!note,
              })}
            >
              <strong className="d-none d-sm-inline">
                {balance >= 0 ? `${debtor}'s Debt` : `My debt to ${debtor}`}
              </strong>
              <strong className="d-xs-inline d-sm-none">{debtor}</strong>
              {' '}
              {note && (
                <sup>
                  <span className="text-warning">
                    <i className="ion-ios-information-circle-outline" aria-hidden />
                  </span>
                  <UncontrolledTooltip target={`debt-${id}`}>{note}</UncontrolledTooltip>
                </sup>
              )}
            </div>
            <small className="text-muted">
              from
              {moment(createdAt).format(MOMENT_DATE_FORMAT)}
            </small>
          </div>
          <div id={`debt-balance-${id}`} className="text-right text-danger font-style-numeric text-nowrap font-weight-bold">
            <span className="d-block font-style-numeric font-weight-bold">
              {currency.symbol}
              {' '}
              {Math.abs(balance.toFixed(2))}
            </span>
            {' '}
            {currency.symbol !== symbol && (
              <small className="d-block font-style-numeric">
                <MoneyValue amount={value} />
              </small>
            )}
          </div>
          <div className="text-right w-150px text-nowrap">
            <Button
              size="sm"
              color="success"
              className="btn-link btn-icon"
              onClick={() => toggleDebtTransactionModal(debt)}
            >
              <i className="tim-icons icon-simple-add" aria-hidden />
            </Button>
            <Button size="sm" color="warning" className="btn-link btn-icon" onClick={() => toggleEdit(debt)}>
              <i className="tim-icons icon-pencil" aria-hidden />
            </Button>
            <Button size="sm" color="info" className="btn-link btn-icon" id={`debt-transactions-${id}`}>
              <i className="mdi mdi-format-list-bulleted" aria-hidden />
            </Button>
          </div>
        </div>

        {transactions.length > 0 && (
          <UncontrolledCollapse toggler={`debt-transactions-${id}`}>
            <Table responsive hover size="sm">
              <tbody>
                {transactions.map((t) => (
                  <TransactionRow
                    key={t.id}
                    transaction={t}
                    handleEdit={editTransaction}
                    handleDelete={deleteTransaction}
                  />
                ))}
              </tbody>
            </Table>
          </UncontrolledCollapse>
        )}
      </>
    );
  });
};

DebtsTable.propTypes = {
  debts: PropTypes.arrayOf(debtType).isRequired,
  toggleEdit: PropTypes.func.isRequired,
  closeDebt: PropTypes.func.isRequired,
  toggleDebtTransactionModal: PropTypes.func.isRequired,
};

export default DebtsTable;
