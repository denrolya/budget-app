import cn from 'classnames';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import {
  Button,
  Row,
  Col,
  CardBody,
  CardFooter,
  CardHeader,
  UncontrolledCollapse,
  UncontrolledTooltip,
} from 'reactstrap';
import sumBy from 'lodash/sumBy';

import TransactionsTable from 'src/components/tables/TransactionsTable';
import DebtForm from 'src/components/forms/DebtForm';
import { DEBT_TRANSACTION_CATEGORY_NAME, EXPENSE_TYPE } from 'src/constants/transactions';
import { useTransactionForm } from 'src/contexts/TransactionFormProvider';
import { registerTransaction, editTransaction, deleteTransaction } from 'src/store/actions/transaction';
import { closeDebt } from 'src/store/actions/debt';
import { toggleDebtModal } from 'src/store/actions/ui';
import { getIsLoading } from 'src/store/selectors/debt';
import AddNewButton from 'src/components/AddNewButton';
import LoadingCard from 'src/components/cards/LoadingCard';
import NoDebtsMessage from 'src/components/messages/NoDebtsMessage';
import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_VIEW_DATE_WITH_YEAR_FORMAT } from 'src/constants/datetime';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const DebtList = ({
  list,
  isLoading,
  registerTransaction,
  editTransaction,
  closeDebt,
  deleteTransaction,
  toggleDebtModal,
}) => {
  const { code } = useBaseCurrency();
  const toggleTransactionForm = useTransactionForm();
  const [selectedDebt, setSelectedDebt] = useState();
  const [isDebtEditModalOpened, setDebtEditModalOpened] = useState(false);

  const total = useMemo(
    () => sumBy(list.filter(({ closedAt }) => !closedAt), ({ convertedValues }) => convertedValues[code]),
    [list],
  );

  const toggleDebtEditModal = (debt) => {
    setSelectedDebt(debt);
    setDebtEditModalOpened(!isDebtEditModalOpened);
  };

  const toggleDebtTransactionModal = ({ id, debtor }) => toggleTransactionForm({
    model: {
      type: EXPENSE_TYPE,
      category: DEBT_TRANSACTION_CATEGORY_NAME,
      debt: id,
      executedAt: moment(),
    },
    onSubmit: ({ type, ...values }) => registerTransaction(type, values),
    title: `Add new transaction to ${debtor}'s debt`,
  });

  const toggleTransactionEditModal = (debt, transaction) => toggleTransactionForm({
    model: transaction,
    onSubmit: ({ id, type, ...values }) => editTransaction(id, type, values),
    title: `Edit ${transaction.type} #${transaction.id}`,
  });

  return (
    <>
      <Helmet>
        <title>
          Debts | Budget
        </title>
      </Helmet>

      <LoadingCard isLoading={isLoading}>
        <CardHeader>
          <div className="tools float-right">
            <AddNewButton onClick={toggleDebtModal} size="sm" color="warning" />
          </div>
          <h5 className="card-title">Debts</h5>
        </CardHeader>
        <CardBody
          className={cn({
            'mb-0 pb-0': list.length > 0,
          })}
        >
          {list.map((debt) => {
            const {
              id, debtor, balance, convertedValues, currency, createdAt, closedAt, transactions, note,
            } = debt;

            return (
              <Row className="mb-2" key={`debt-${id}`}>
                <Col
                  xs={3}
                  className={cn('text-left', 'text-nowrap', {
                    'opacity-6': !!closedAt,
                  })}
                >
                  <p
                    id={`debt-${id}`}
                    className={cn('m-0', 'd-inline-block', {
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
                          <i aria-hidden className="ion-ios-information-circle-outline" />
                        </span>
                        <UncontrolledTooltip placement="right" target={`debt-${id}`}>
                          {note}
                        </UncontrolledTooltip>
                      </sup>
                    )}
                  </p>
                  <small className="d-block text-muted">
                    from
                    {' '}
                    {moment(createdAt).format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}
                  </small>
                </Col>

                <Col xs={6} className="text-danger text-currency text-nowrap text-center font-weight-bold">
                  <MoneyValue amount={Math.abs(balance)} currency={currency} values={convertedValues} />
                </Col>

                <Col xs={3} className="text-nowrap text-right">
                  <Button
                    size="sm"
                    color="danger"
                    className="btn-link btn-icon btn-simple m-0"
                    onClick={() => closeDebt(debt)}
                  >
                    <i aria-hidden className="ion-ios-close-circle-outline" />
                  </Button>
                  <Button
                    size="sm"
                    color="success"
                    className="btn-link btn-icon btn-simple m-0"
                    onClick={() => toggleDebtTransactionModal(debt)}
                  >
                    <i aria-hidden className="tim-icons icon-simple-add" />
                  </Button>
                  <Button
                    size="sm"
                    color="warning"
                    className="btn-link btn-icon btn-simple m-0"
                    onClick={() => toggleDebtEditModal(debt)}
                  >
                    <i aria-hidden className="tim-icons icon-pencil" />
                  </Button>
                  <Button
                    size="sm"
                    color="info"
                    className="btn-link btn-icon btn-simple m-0"
                    id={`debt-transactions-${id}`}
                  >
                    <i aria-hidden className="mdi mdi-format-list-bulleted" />
                  </Button>
                </Col>

                {transactions.length > 0 && (
                  <UncontrolledCollapse className="w-100 px-5 py-4 opacity-8" toggler={`debt-transactions-${id}`}>
                    <TransactionsTable
                      data={transactions}
                      editTransaction={(t) => toggleTransactionEditModal(debt, t)}
                      deleteTransaction={(t) => deleteTransaction(t)}
                    />
                  </UncontrolledCollapse>
                )}
              </Row>
            );
          })}

          {!isLoading && list.length === 0 && <NoDebtsMessage />}
        </CardBody>
        {list.length > 0 && (
          <CardFooter className="pt-0">
            <p className="text-right">
              <span
                className={cn('font-weight-bold', {
                  'text-danger': total !== 0,
                  'text-success': total === 0,
                })}
              >
                <MoneyValue amount={total} />
              </span>
            </p>
          </CardFooter>
        )}
      </LoadingCard>

      {selectedDebt && (
        <DebtForm
          title={`Edit ${selectedDebt.debtor}'s Debt`}
          model={selectedDebt}
          isOpen={isDebtEditModalOpened}
          toggleModal={() => toggleDebtEditModal()}
        />
      )}
    </>
  );
};

DebtList.propTypes = {
  closeDebt: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      debtor: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
      convertedValues: PropTypes.object.isRequired,
      currency: PropTypes.string.isRequired,
    }),
  ).isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  registerTransaction: PropTypes.func.isRequired,
  editTransaction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  toggleDebtModal: PropTypes.func.isRequired,
};

const mapStateToProps = ({ debt: list, ui }) => ({
  list,
  isLoading: getIsLoading({ ui }),
  isDebtModalOpened: ui.isDebtModalOpened,
});

export default connect(mapStateToProps, {
  closeDebt,
  registerTransaction,
  editTransaction,
  toggleDebtModal,
  deleteTransaction,
})(DebtList);
