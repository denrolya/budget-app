import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Table, Container, Row, Col, Form, FormGroup, Label, Input, Card, Button,
} from 'reactstrap';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { convert } from 'src/services/currency';

const CURRENCIES = {
  EUR: 'Euro',
  USD: 'US Dollar',
  HUF: 'Hungarian Forint',
  UAH: 'Ukrainian Hryvnia',
  BTC: 'Bitcoin',
};

const CURRENCY_TUPLES = [
  ['EUR', 'UAH'],
  ['USD', 'UAH'],
  ['HUF', 'UAH'],
  ['EUR', 'USD'],
  ['BTC', 'USD'],
  ['BTC', 'EUR'],
];
const EXAMPLES = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 5000, 20000];

const CurrencyConverter = ({ exchangeRates }) => {
  const currencyCodes = Object.keys(CURRENCIES);

  const initialValues = {
    amount: 0,
    from: currencyCodes[0],
    to: currencyCodes[1],
  };

  const validationSchema = Yup.object({
    amount: Yup.number(),
    from: Yup.string().oneOf(currencyCodes),
    to: Yup.string().oneOf(currencyCodes),
  });

  if (!exchangeRates) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>
          Currency converter | Budget
        </title>
      </Helmet>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={undefined}
      >
        {({
          values,
          touched,
          errors,
          setFieldValue,
        }) => {
          const { amount, from, to } = values;
          const result = convert(exchangeRates, amount, from, to).toString();
          const setFromTo = (f, t, a = 1) => {
            setFieldValue('from', f);
            setFieldValue('to', t);
            setFieldValue('amount', a);
          };

          const swapCurrencies = () => setFromTo(to, from);

          return (
            <Container>
              {CURRENCY_TUPLES.map(([f, t]) => (
                <Button
                  color="primary"
                  size="sm"
                  className="btn-round font-weight-normal"
                  key={`convert-button-${f}-${t}`}
                  onClick={() => {
                    if (f === from && t === to) {
                      setFromTo(t, f);
                    } else {
                      setFromTo(f, t);
                    }
                  }}
                >
                  {f}
                  {' '}
                  <i aria-hidden className="ion-ios-swap" />
                  {' '}
                  {t}
                </Button>
              ))}
              <Card body>
                <Form>
                  <Row>
                    <Col xs={12} md={5} className="order-1">
                      <FormGroup>
                        <Label for="amount">Amount</Label>
                        <Field
                          id="amount"
                          name="amount"
                          type="number"
                          step="any"
                          placeholder="Enter the amount"
                          as={Input}
                          min={0}
                          value={amount}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={6} md={3} className="order-2">
                      <FormGroup>
                        <Label for="from">From</Label>
                        <Field id="from" name="from" type="select" as={Input} value={from}>
                          {currencyCodes.map((currency) => (
                            <option key={`currency-from-${currency}`} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage component="div" name="from" className="invalid-feedback" />
                      </FormGroup>
                    </Col>
                    <Col xs={12} md={1} className="align-center order-last order-md-3">
                      <Button color="primary" className="btn-round btn-outline btn-icon" onClick={swapCurrencies}>
                        <i className="ion-ios-swap" aria-hidden />
                      </Button>
                    </Col>
                    <Col xs={6} md={3} className="order-3 order-md-last">
                      <FormGroup>
                        <Label for="to">To</Label>
                        <Field
                          id="to"
                          name="to"
                          type="select"
                          as={Input}
                          invalid={touched.to && !!errors.to}
                          value={to}
                        >
                          {currencyCodes.map((currency) => (
                            <option key={`currency-to-${currency}`} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage component="div" name="to" className="invalid-feedback" />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </Card>

              {!!amount && (
                <>
                  <div className="mb-5">
                    <h3 className="font-style-numeric">
                      {amount}
                      {' '}
                      {CURRENCIES[from]}
                      {amount > 1 && 's'}
                      {' '}
                      =
                    </h3>
                    <h2 className="font-style-numeric">
                      <span className="font-style-numeric">
                        {result.slice(0, result.indexOf('.') + 3)}
                        <span className="text-muted">{result.slice(result.indexOf('.') + 3)}</span>
                      </span>
                      {' '}
                      {CURRENCIES[to]}
                      {result > 1 && 's'}
                    </h2>
                    <p className="font-style-numeric">
                      1
                      {' '}
                      {from}
                      {' '}
                      =
                      {' '}
                      {exchangeRates[from] / exchangeRates[to]}
                      {' '}
                      {to}
                    </p>
                    <p className="font-style-numeric">
                      1
                      {' '}
                      {to}
                      {' '}
                      =
                      {' '}
                      {exchangeRates[to] / exchangeRates[from]}
                      {' '}
                      {from}
                    </p>
                  </div>
                  <Row>
                    <Col>
                      <Card body>
                        <Table>
                          <tbody>
                            {EXAMPLES.map((number) => (
                              <tr key={number}>
                                <td className="text-center font-style-numeric">
                                  {number}
                                  {' '}
                                  {from}
                                </td>
                                <td className="text-center font-style-numeric">
                                  {parseFloat(convert(exchangeRates, number, from, to).toFixed(2)).toLocaleString()}
                                  {' '}
                                  {to}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card>
                    </Col>
                    <Col>
                      <Card body>
                        <Table>
                          <tbody>
                            {EXAMPLES.map((number) => (
                              <tr key={number}>
                                <td className="text-center font-style-numeric">
                                  {number}
                                  {' '}
                                  {to}
                                </td>
                                <td className="text-center font-style-numeric">
                                  {parseFloat(convert(exchangeRates, number, to, from).toFixed(2)).toLocaleString()}
                                  {' '}
                                  {from}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </Container>
          );
        }}
      </Formik>
    </>
  );
};

CurrencyConverter.propTypes = {
  exchangeRates: PropTypes.object,
};

const mapStateToProps = ({ exchangeRates }) => ({ exchangeRates });

export default connect(mapStateToProps)(CurrencyConverter);
