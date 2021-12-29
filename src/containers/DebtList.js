import cn from 'classnames';
import moment from 'moment-timezone/index';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
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
import DebtTransactionModalForm from 'src/components/forms/DebtTransactionModalForm';
import ModalForm from 'src/components/forms/ModalForm';
import TransactionModalForm from 'src/components/forms/TransactionModalForm';
import { isActionLoading } from 'src/services/common';
import {
  closeDebt,
  deleteDebtTransaction,
  editDebtTransaction,
  fetchList,
  toggleWithClosedFilter,
} from 'src/store/actions/debt';
import { toggleDebtModal } from 'src/store/actions/ui';
import { getIsLoading } from 'src/store/selectors/debt';
import AddNewButton from 'src/components/AddNewButton';
import LoadingCard from 'src/components/cards/LoadingCard';
import NoDebtsMessage from 'src/components/messages/NoDebtsMessage';
import MoneyValue from 'src/components/MoneyValue';
import { MOMENT_VIEW_DATE_WITH_YEAR_FORMAT } from 'src/constants/datetime';
import { useBaseCurrency } from 'src/contexts/BaseCurrency';

const DebtList = ({
  debts,
  withClosed,
  isLoading,
  isTransactionEditInProgress,
  fetchList,
  editDebtTransaction,
  closeDebt,
  deleteDebtTransaction,
  toggleDebtModal,
  toggleWithClosedFilter,
}) => {
  const { code } = useBaseCurrency();
  const [selectedDebt, setSelectedDebt] = useState();
  const [isTransactionEditModalOpened, setTransactionEditModalOpened] = useState(false);
  const [isDebtEditModalOpened, setDebtEditModalOpened] = useState(false);
  const [newTransactionDebt, setNewTransactionDebt] = useState(null);
  const [isDebtTransactionModalOpened, setDebtTransactionModalOpened] = useState(false);
  const [selectedTransaction, selectTransaction] = useState();

  const total = useMemo(() => sumBy(debts, ({ values }) => values[code]), [debts]);

  useEffect(() => {
    fetchList();
  }, []);

  const toggleDebtEditModal = (debt) => {
    setSelectedDebt(debt);
    setDebtEditModalOpened(!isDebtEditModalOpened);
  };

  const toggleDebtTransactionModal = (debt) => {
    setNewTransactionDebt(debt);
    setDebtTransactionModalOpened(!isDebtTransactionModalOpened);
  };

  const toggleTransactionEditModal = (debt, transaction) => {
    setSelectedDebt(debt);
    selectTransaction(transaction);
    setTransactionEditModalOpened(!isTransactionEditModalOpened);
  };

  return (
    <>
      <LoadingCard isLoading={isLoading}>
        <CardHeader>
          <div className="tools float-right">
            <Button
              size="sm"
              color="info"
              className={cn('btn-icon', 'mr-2', {
                'btn-simple': !withClosed,
              })}
              onClick={toggleWithClosedFilter}
            >
              <i aria-hidden className="tim-icons icon-trash-simple" />
            </Button>

            <AddNewButton onClick={toggleDebtModal} size="sm" color="warning" />
          </div>
          <h5 className="card-title">Debts</h5>
        </CardHeader>
        <CardBody
          className={cn({
            'mb-0 pb-0': debts.length > 0,
          })}
        >
          {debts.map((debt) => {
            const {
              id, debtor, balance, values, currency, createdAt, closedAt, transactions, note,
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
                  <MoneyValue amount={Math.abs(balance)} currency={currency} values={values} />
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
                      deleteTransaction={(t) => deleteDebtTransaction(debt, t)}
                    />
                  </UncontrolledCollapse>
                )}
              </Row>
            );
          })}

          {!isLoading && debts.length === 0 && <NoDebtsMessage />}
        </CardBody>
        {debts.length > 0 && (
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
        <ModalForm
          title={`Edit ${selectedDebt.debtor}'s Debt`}
          isOpen={isDebtEditModalOpened}
          toggleModal={() => toggleDebtEditModal()}
        >
          <DebtForm data={selectedDebt} toggleModal={() => toggleDebtEditModal()} />
        </ModalForm>
      )}

      {newTransactionDebt && (
        <DebtTransactionModalForm
          debt={newTransactionDebt}
          isOpened={isDebtTransactionModalOpened}
          toggle={() => toggleDebtTransactionModal()}
        />
      )}

      {selectedTransaction && (
        <TransactionModalForm
          model={selectedTransaction}
          isLoading={isTransactionEditInProgress}
          onSubmit={(t) => editDebtTransaction(selectedDebt, t)}
          title={`Edit ${selectedTransaction.type} #${selectedTransaction.id}`}
          isOpen={isTransactionEditModalOpened}
          toggleTransactionModal={() => toggleTransactionEditModal()}
        />
      )}
    </>
  );
};

DebtList.defaultProps = {
  withClosed: false,
};

DebtList.propTypes = {
  closeDebt: PropTypes.func.isRequired,
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      debtor: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
      values: PropTypes.object.isRequired,
      currency: PropTypes.string.isRequired,
    }),
  ).isRequired,
  deleteDebtTransaction: PropTypes.func.isRequired,
  editDebtTransaction: PropTypes.func.isRequired,
  fetchList: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isTransactionEditInProgress: PropTypes.bool.isRequired,
  toggleDebtModal: PropTypes.func.isRequired,
  toggleWithClosedFilter: PropTypes.func.isRequired,
  withClosed: PropTypes.bool,
};

const mapStateToProps = ({ debt, ui }) => ({
  debts: debt.debts,
  withClosed: debt.withClosed,
  isLoading: getIsLoading({ ui }),
  isTransactionEditInProgress: isActionLoading(ui.TRANSACTION_EDIT),
  isDebtModalOpened: ui.isDebtModalOpened,
});

export default connect(mapStateToProps, {
  fetchList,
  closeDebt,
  editDebtTransaction,
  toggleDebtModal,
  deleteDebtTransaction,
  toggleWithClosedFilter,
})(DebtList);
