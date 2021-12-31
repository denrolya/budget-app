import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Row, Col, Button } from 'reactstrap';

import { generateLinkToAccountTransactionsPage } from 'src/services/routing';
import TransactionsCountByMonth from 'src/components/charts/recharts/bar/TransactionsCountByMonth';
import TransactionsTable from 'src/components/tables/TransactionsTable';

const AccountTransactionsDetails = ({ account }) => {
  const {
    name, numberOfTransactions, lastTransactionAt, latestTransactions, logs,
  } = account;

  const transactionFrequency = useMemo(() => {
    const logPeriodInHours = logs[logs.length - 1].date.diff(logs[0].date, 'hours');
    return Math.round(logPeriodInHours / logs.length);
  }, [logs]);

  const transactionsCountByMonths = useMemo(() => {
    const result = {};
    logs.forEach(({ date }) => {
      if (result[date.month()] === undefined) {
        result[date.month()] = 0;
      }
      result[date.month()] += 1;
    });

    return Object.keys(result).map((month) => ({
      date: moment().month(month),
      value: result[month],
    }));
  }, [logs]);

  const transactionsCountingFrom = moment().subtract(7, 'days');
  const daysFromLastTransaction = moment().startOf('day').diff(moment(lastTransactionAt).startOf('day'), 'days') + 1;

  return (
    <section>
      <Row>
        <Col xs={12} md={6}>
          <Row className="mb-3">
            <Col xs={4} className="d-flex flex-column justify-content-between">
              <span className="h5 mb-2">Last Tr.</span>
              <span className="h1 mb-4 font-weight-light">
                {daysFromLastTransaction === 0 && 'Today'}
                {daysFromLastTransaction}
                d
                <span style={{ fontSize: 15 }}>ago</span>
              </span>
            </Col>
            <Col xs={4} className="d-flex flex-column justify-content-between">
              <span className="h5 mb-2">Total Tr.</span>
              <span className="h1 mb-4 font-weight-light">{numberOfTransactions}</span>
            </Col>
            <Col xs={4} className="d-flex flex-column justify-content-between">
              <span className="h5 mb-2">In last 7 days</span>
              <span className="h1 mb-4 font-weight-light">
                {account.logs.filter(({ date }) => date.isBefore(transactionsCountingFrom)).length}
              </span>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <span className="h5 mb-2 d-block">Transaction frequency over last 12 months</span>
              <span className="h1 mb-2 font-weight-light d-block">
                Every
                {transactionFrequency}
                {' '}
                hours
              </span>
            </Col>
          </Row>

          <span className="h5 mb-2 d-block">Monthly Transactions</span>
          <Row className="mb-5 gx-0">
            <Col xs={4} className="d-flex flex-column justify-content-center">
              <span className="h1 mb-2 font-weight-light d-block text-nowrap">
                {transactionsCountByMonths[moment().month() - 1]?.value || 0}
              </span>
              <span className="h5 m-0 d-block">Last month</span>
            </Col>
            <Col xs={8} className="">
              <TransactionsCountByMonth data={transactionsCountByMonths} width="100%" height={120} />
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6}>
          <span className="h5 mb-2 d-block">Latest Transactions</span>
          <div className="content-preview">
            <div className="content-preview-inner">
              {account?.latestTransactions && (
                <TransactionsTable data={latestTransactions} editTransaction={() => {}} deleteTransaction={() => {}} />
              )}
            </div>
          </div>

          <p className="text-center py-3">
            <Button color="link">
              <Link to={generateLinkToAccountTransactionsPage(name)}>
                See all Transactions
                {'>'}
              </Link>
            </Button>
          </p>
        </Col>
      </Row>
    </section>
  );
};

AccountTransactionsDetails.defaultProps = {};

AccountTransactionsDetails.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string.isRequired,
    numberOfTransactions: PropTypes.number.isRequired,
    logs: PropTypes.array.isRequired,
    lastTransactionAt: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    latestTransactions: PropTypes.array,
  }).isRequired,
};

export default AccountTransactionsDetails;
