import { createContext, useContext } from 'react';

export const DEFAULT_VALUE = {
  EUR: 1,
  USD: 1,
  UAH: 1,
  HUF: 1,
  BTC: 1,
  ETH: 1,
};

const ExchangeRatesContext = createContext(DEFAULT_VALUE);

export const useRates = () => useContext(ExchangeRatesContext);

export default ExchangeRatesContext;
