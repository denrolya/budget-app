import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExchangeRatesContext from 'src/contexts/ExchangeRatesContext';

import { fetch as fetchExchangeRates } from 'src/store/actions/exchangeRates';

const ExchangeRatesProvider = ({ exchangeRates, fetchExchangeRates, children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        setIsLoading(true);
      }

      try {
        await fetchExchangeRates();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return null;
  }

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
