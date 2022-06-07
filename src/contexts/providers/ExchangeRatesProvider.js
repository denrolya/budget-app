import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExchangeRatesContext from 'src/contexts/ExchangeRatesContext';

import { fetch as fetchExchangeRates } from 'src/store/actions/exchangeRates';

const ExchangeRatesProvider = ({ exchangeRates, fetchExchangeRates, children }) => {
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  return (
    <ExchangeRatesContext.Provider value={exchangeRates}>
      {children}
    </ExchangeRatesContext.Provider>
  );
};

ExchangeRatesProvider.propTypes = {
  exchangeRates: PropTypes.shape({}).isRequired,
  fetchExchangeRates: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};

const mapStateToProps = ({ exchangeRates }) => ({ exchangeRates });

export default connect(mapStateToProps, { fetchExchangeRates })(ExchangeRatesProvider);
