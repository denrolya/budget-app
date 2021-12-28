import { createContext, useContext } from 'react';

export const BaseCurrencyContext = createContext({
  name: 'Euro',
  code: 'EUR',
  symbol: '€',
});

export const useBaseCurrency = () => useContext(BaseCurrencyContext);

export default BaseCurrencyContext;
