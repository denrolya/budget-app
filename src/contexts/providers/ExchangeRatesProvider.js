import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExchangeRatesContext from 'src/contexts/ExchangeRatesContext';

const ExchangeRatesProvider = ({ exchangeRates, children }) => (
  <ExchangeRatesContext.Provider value={exchangeRates}>
    {children}
  </ExchangeRatesContext.Provider>
);

ExchangeRatesProvider.propTypes = {
  exchangeRates: PropTypes.shape({}).isRequired,
  children: PropTypes.any.isRequired,
};

const mapStateToProps = ({ exchangeRates }) => ({ exchangeRates });

export default connect(mapStateToProps)(ExchangeRatesProvider);
