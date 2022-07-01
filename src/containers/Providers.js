import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CURRENCIES } from 'src/constants/currency';
import { isActionResolved } from 'src/utils/common';

import BaseCurrencyContext from 'src/contexts/BaseCurrency';
import AccountsProvider from 'src/contexts/providers/AccountsProvider';
import CategoriesProvider from 'src/contexts/providers/CategoriesProvider';
import ExchangeRatesProvider from 'src/contexts/providers/ExchangeRatesProvider';
import TransactionFormProvider from 'src/contexts/TransactionFormProvider';

import { fetchList as fetchCategories } from 'src/store/actions/category';
import { fetchList as fetchDebts } from 'src/store/actions/debt';
import { fetchList as fetchAccounts } from 'src/store/actions/account';
import { fetch as fetchExchangeRates } from 'src/store/actions/exchangeRates';

const Providers = ({
  baseCurrency,
  isExchangeRatesLoaded,
  isVitalDataLoaded,
  fetchExchangeRates,
  fetchAccounts,
  fetchCategories,
  fetchDebts,
  children,
}) => {
  const [showContent, setShowContent] = useState(false);
  const calledOnce = useRef(false);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isExchangeRatesLoaded) {
        await fetchAccounts();
        await fetchCategories();
        await fetchDebts();
      }
    };

    fetchData();
  }, [isExchangeRatesLoaded]);

  useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    if (isVitalDataLoaded === true) {
      calledOnce.current = true;
      setShowContent(true);
    }
  }, [isVitalDataLoaded]);

  return (
    <BaseCurrencyContext.Provider value={baseCurrency}>
      <ExchangeRatesProvider>
        <AccountsProvider>
          <CategoriesProvider>
            <TransactionFormProvider>
              { showContent && children }
            </TransactionFormProvider>
          </CategoriesProvider>
        </AccountsProvider>
      </ExchangeRatesProvider>
    </BaseCurrencyContext.Provider>
  );
};

Providers.defaultProps = {
  isExchangeRatesLoaded: false,
  isVitalDataLoaded: false,
};

Providers.propTypes = {
  baseCurrency: PropTypes.shape({
    code: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['fiat', 'crypto']).isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  fetchExchangeRates: PropTypes.func.isRequired,
  fetchAccounts: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchDebts: PropTypes.func.isRequired,
  isExchangeRatesLoaded: PropTypes.bool,
  isVitalDataLoaded: PropTypes.bool,
};

const mapStateToProps = ({ auth: { user }, ui }) => ({
  baseCurrency: CURRENCIES[user?.baseCurrency || 'EUR'],
  isExchangeRatesLoaded: isActionResolved(ui.EXCHANGE_RATES_FETCH),
  isVitalDataLoaded: isActionResolved(ui.ACCOUNT_FETCH_LIST) && isActionResolved(ui.DEBT_FETCH_LIST) && isActionResolved(ui.EXCHANGE_RATES_FETCH),
});

export default connect(mapStateToProps, {
  fetchExchangeRates,
  fetchAccounts,
  fetchDebts,
  fetchCategories,
})(Providers);
