import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment-timezone';
import {
  Row, Col, Button, UncontrolledPopover, PopoverBody,
} from 'reactstrap';

import AccountBalance from 'src/components/charts/recharts/area/AccountBalance';
import MoneyValue from 'src/components/MoneyValue';
import { useRates } from 'src/contexts/ExchangeRatesContext';
import { convert, generateExchangeRatesStatistics } from 'src/utils/currency';
import { MOMENT_VIEW_DATE_WITH_YEAR_FORMAT } from 'src/constants/datetime';
import TransactionCategoriesRadial from 'src/components/charts/recharts/radial/TransactionCategoriesRadial';
import {
  ACCOUNT_TYPE_BANK_CARD,
  ACCOUNT_TYPE_BASIC,
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_INTERNET,
} from 'src/constants/account';
import AccountNameForm from 'src/components/forms/AccountNameForm';
import AccountColorForm from 'src/components/forms/AccountColorForm';
import { copyToClipboard } from 'src/utils/common';

const AccountGeneralInfo = ({
  data,
  onArchive,
  onRestore,
  onNameChange,
  onColorChange,
}) => {
  const {
    balance,
    color,
    icon,
    name,
    type,
    logs,
    archivedAt,
    currency,
    totalIncome,
    totalExpense,
    topExpenseCategories,
    topIncomeCategories,
  } = data;
  const exchangeRates = useRates();

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
                  <AccountColorForm color={color} onSubmit={(values) => onColorChange(data, values.color)} />
                </PopoverBody>
              </UncontrolledPopover>

              <div className="d-none d-md-block">
                <AccountNameForm value={name} onSubmit={(values) => onNameChange(data, values.name)} />
              </div>

              <div className="d-block d-md-none text-nowrap">{name}</div>
            </div>
          </Col>
          <Col xs={6} className="text-right">
            <p
              className={cn('mb-2', {
                'text-danger': balance < 0,
                'text-success': balance > 0,
              })}
            >
              <span className="h2">
                <MoneyValue currency={currency} amount={balance} maximumFractionDigits={currency === 'BTC' ? 10 : 2} />
              </span>
            </p>
          </Col>
        </Row>
        <h4 className="mb-1">
          Created:
          {' '}
          <i aria-hidden className="ion-ios-calendar" />
          {' '}
          {moment(data.createdAt).format(MOMENT_VIEW_DATE_WITH_YEAR_FORMAT)}
        </h4>
        <hr />
      </section>

      {logs.length > 0 && (
        <section className="mb-2">
          <AccountBalance account={data} />
          <hr />
        </section>
      )}

      <section>
        <div className="d-flex justify-content-between">
          {(exchangeData.length > 0) && (
            <div>
              <h3 className="mb-1">Exchange Rates</h3>
              {isEmpty(exchangeRates) && (
                <code className="text-muted">
                  <Button size="sm" color="warning" className="btn-link">
                    <i aria-hidden className="ion-ios-refresh" />
                  </Button>
                  {' '}
                  No exchange rates.
                </code>
              )}
              {!isEmpty(exchangeRates) && exchangeData.map(({ from, to, amount }) => (
                <p key={`exchange-data-${from}-${to}`}>
                  <MoneyValue bold currency={from} amount={amount} />
                  {' = '}
                  <MoneyValue bold currency={to} amount={convert(exchangeRates, amount, from, to)} />
                </p>
              ))}
            </div>
          )}

          {type === ACCOUNT_TYPE_BANK_CARD && (
            <div className="text-right">
              <dl>
                {data.iban && (
                  <>
                    <dt>IBAN: </dt>
                    <dd
                      className="cursor-copy"
                      onClick={() => copyToClipboard(data.iban)}
                    >
                      {data.iban}
                    </dd>
                  </>
                )}
                {data.cardNumber && (
                  <>
                    <dt>Card number: </dt>
                    <dd
                      className="cursor-copy"
                      onClick={() => copyToClipboard(data.cardNumber)}
                    >
                      {data.cardNumber.match(/.{1,4}/g).join(' ')}
                    </dd>
                  </>
                )}
                {data.monobankId && (
                  <>
                    <dt>Monobank ID: </dt>
                    <dd
                      className="cursor-copy"
                      onClick={() => copyToClipboard(data.monobankId)}
                    >
                      {data.monobankId}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          )}
        </div>

        <hr />
      </section>

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
              <TransactionCategoriesRadial legend="left" account={data} data={topExpenseCategories} />
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
              <TransactionCategoriesRadial legend="left" account={data} data={topIncomeCategories} />
            )}
          </Col>
        </Row>

        <hr />
      </section>

      {archivedAt && (
        <section>
          <h3 className="mb-1">Restore account</h3>
          <Button color="info" className="btn-simple" onClick={() => onRestore(data)}>
            Restore
          </Button>
        </section>
      )}

      {!archivedAt && (
        <section>
          <h3 className="mb-1">Archive account</h3>
          <Button color="danger" className="btn-simple" onClick={() => onArchive(data)}>
            Archive
          </Button>
        </section>
      )}
    </>
  );
};

AccountGeneralInfo.defaultProps = {};

AccountGeneralInfo.propTypes = {
  data: PropTypes.shape({
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
    totalIncome: PropTypes.number.isRequired,
    totalExpense: PropTypes.number.isRequired,
    topExpenseCategories: PropTypes.array.isRequired,
    topIncomeCategories: PropTypes.array.isRequired,
  }).isRequired,
  onArchive: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
};

export default AccountGeneralInfo;
