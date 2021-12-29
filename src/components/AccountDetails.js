import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import {
  Row, Col, Button, UncontrolledPopover, PopoverBody,
} from 'reactstrap';

import AccountBalance from 'src/components/charts/recharts/AccountBalance';
import MoneyValue from 'src/components/MoneyValue';
import { convert, generateExchangeRatesStatistics } from 'src/services/currency';
import { MOMENT_VIEW_DATE_WITH_YEAR_FORMAT } from 'src/constants/datetime';
import TransactionCategoriesRadial from 'src/components/charts/recharts/TransactionCategoriesRadial';
import {
  ACCOUNT_TYPE_BANK_CARD,
  ACCOUNT_TYPE_BASIC,
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_INTERNET,
} from 'src/constants/account';
import AccountNameForm from 'src/components/forms/AccountNameForm';
import AccountColorForm from 'src/components/forms/AccountColorForm';
import { copyToClipboard } from 'src/services/common';

const AccountDetails = ({
  data, exchangeRates, onArchive, onRestore, onNameChange, onColorChange,
}) => {
  const {
    account, totalIncome, totalExpense, topExpenseCategories, topIncomeCategories,
  } = data;
  const {
    balance, color, icon, name, type, archivedAt, currency,
  } = account;

  const exchangeData = generateExchangeRatesStatistics(currency);

  return (
    <>
      <section>
        <Row>
          <Col xs={6}>
            <div className="mb-0 h1 d-flex align-items-baseline">
              <i
                aria-hidden
                id="color-popover"
                style={{
                  color,
                }}
                className={cn('mr-3', icon)}
              />

              <UncontrolledPopover placement="bottom" target="color-popover">
                <PopoverBody>
                  <AccountColorForm color={color} onSubmit={(values) => onColorChange(account, values.color)} />
                </PopoverBody>
              </UncontrolledPopover>

              <div className="d-none d-md-block">
                <AccountNameForm value={name} onSubmit={(values) => onNameChange(account, values.name)} />
              </div>

              <div className="d-block d-md-none text-nowrap">{name}</div>
            </div>

            {account.iban && (
              <span
                className="h4 mb-1 text-uppercase cursor-copy d-inline-block"
                onClick={() => copyToClipboard(account.iban)}
              >
                {account.iban}
              </span>
            )}

            {account.cardNumber && (
              <h4 className="mb-1 cursor-copy d-inline-block" onClick={() => copyToClipboard(account.cardNumber)}>
                {account.cardNumber.match(/.{1,4}/g).join(' ')}
              </h4>
            )}

            <h5 className="mb-1">
              <i aria-hidden className="ion-ios-calendar" />
              {' '}
              Created:
              {' '}
              {moment(account.createdAt).format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}
            </h5>
          </Col>
          <Col xs={6} className="text-right">
            <p
              className={cn('mb-2', {
                'text-danger': balance < 0,
                'text-success': balance > 0,
              })}
            >
              <span className="h2">
                <MoneyValue currency={currency} amount={balance} />
              </span>
            </p>
          </Col>
        </Row>
      </section>

      {account.logs.length > 0 && (
        <section className="mb-2">
          <AccountBalance account={account} />
        </section>
      )}

      {exchangeData.length > 0 && (
        <section>
          <h3 className="mb-1">Exchange Rates</h3>
          {exchangeData.map(({ from, to, amount }) => (
            <p key={`exchange-data-${from}-${to}`}>
              <MoneyValue bold currency={from} amount={amount} />
              {' = '}
              <MoneyValue bold currency={to} amount={convert(exchangeRates, amount, from, to)} />
            </p>
          ))}

          <hr />
        </section>
      )}

      <section>
        <Row>
          <Col xs={12} md={6}>
            <h3 className="mb-1">
              Expenses:
              {' '}
              <span className="text-danger">
                <MoneyValue amount={totalExpense} />
              </span>
            </h3>
            {totalExpense > 0 && (
              <TransactionCategoriesRadial legend="left" account={account} data={topExpenseCategories} />
            )}
          </Col>
          <Col xs={12} md={6}>
            <h3 className="mb-1">
              Incomes:
              {' '}
              <span className="text-success">
                <MoneyValue amount={totalIncome} />
              </span>
            </h3>
            {totalIncome > 0 && (
              <TransactionCategoriesRadial legend="left" account={account} data={topIncomeCategories} />
            )}
          </Col>
        </Row>

        <hr />
      </section>

      {type === ACCOUNT_TYPE_BANK_CARD && account.monobankId && (
        <section>
          <p className="cursor-copy" onClick={() => copyToClipboard(account.monobankId)}>
            MonoBank ID:
            {' '}
            {account.monobankId}
          </p>
          <hr />
        </section>
      )}

      {archivedAt && (
        <section>
          <h3 className="mb-1">Restore account</h3>
          <Button color="info" className="btn-simple" onClick={() => onRestore(account)}>
            Restore
          </Button>
        </section>
      )}

      {!archivedAt && (
        <section>
          <h3 className="mb-1">Archive account</h3>
          <Button color="danger" className="btn-simple" onClick={() => onArchive(account)}>
            Archive
          </Button>
        </section>
      )}
    </>
  );
};

AccountDetails.defaultProps = {
  exchangeRates: {},
};

AccountDetails.propTypes = {
  data: PropTypes.shape({
    account: PropTypes.shape({
      balance: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf([ACCOUNT_TYPE_BANK_CARD, ACCOUNT_TYPE_INTERNET, ACCOUNT_TYPE_CASH, ACCOUNT_TYPE_BASIC])
        .isRequired,
      archivedAt: PropTypes.string,
      logs: PropTypes.array,
      createdAt: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
      monobankId: PropTypes.string,
      iban: PropTypes.string,
      cardNumber: PropTypes.string,
    }),
    totalIncome: PropTypes.number.isRequired,
    totalExpense: PropTypes.number.isRequired,
    topExpenseCategories: PropTypes.array.isRequired,
    topIncomeCategories: PropTypes.array.isRequired,
  }).isRequired,
  onArchive: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  exchangeRates: PropTypes.object,
};

export default AccountDetails;
