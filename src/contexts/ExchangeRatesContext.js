import { createContext, useContext } from 'react';

const ExchangeRatesContext = createContext({
  EUR: 1,
  USD: 1,
  UAH: 1,
  HUF: 1,
  BTC: 1,
  ETH: 1,
});

export const useRates = () => useContext(ExchangeRatesContext);

export default ExchangeRatesContext;
