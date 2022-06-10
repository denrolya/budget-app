import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CURRENCIES } from 'src/constants/currency';
import BaseCurrencyContext from 'src/contexts/BaseCurrency';
import AccountsProvider from 'src/contexts/providers/AccountsProvider';
import CategoriesProvider from 'src/contexts/providers/CategoriesProvider';
import ExchangeRatesProvider from 'src/contexts/providers/ExchangeRatesProvider';
import TransactionFormProvider from 'src/contexts/TransactionFormProvider';

const Providers = ({ baseCurrency, children }) => (
  <BaseCurrencyContext.Provider value={baseCurrency}>
    <ExchangeRatesProvider>
      <AccountsProvider>
        <CategoriesProvider>
          <TransactionFormProvider>
            { children }
          </TransactionFormProvider>
        </CategoriesProvider>
      </AccountsProvider>
    </ExchangeRatesProvider>
  </BaseCurrencyContext.Provider>
);

Providers.defaultProps = {};

Providers.propTypes = {
  baseCurrency: PropTypes.shape({
    code: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['fiat', 'crypto']).isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

const mapStateToProps = ({ auth: { user } }) => ({
  baseCurrency: CURRENCIES[user?.baseCurrency || 'EUR'],
});

export default connect(mapStateToProps)(Providers);
