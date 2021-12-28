export const convert = (rates, amount, from, to) => (1 / rates[from]) * amount * rates[to];

const USD_UAH = {
  from: 'USD',
  to: 'UAH',
  amount: 1,
};

const EUR_UAH = {
  from: 'EUR',
  to: 'UAH',
  amount: 1,
};

const EUR_HUF = {
  from: 'EUR',
  to: 'HUF',
  amount: 1,
};

const EUR_USD = {
  from: 'EUR',
  to: 'USD',
  amount: 1,
};

const BTC_EUR = {
  from: 'BTC',
  to: 'EUR',
  amount: 1,
};

const BTC_USD = {
  from: 'BTC',
  to: 'USD',
  amount: 1,
};

const USD_HUF = {
  from: 'USD',
  to: 'HUF',
  amount: 1,
};

const HUF_UAH = {
  from: 'HUF',
  to: 'UAH',
  amount: 1000,
};

export const generateExchangeRatesStatistics = (baseCurrency) => {
  let result = [];

  switch (baseCurrency) {
    case 'UAH':
      result = [USD_UAH, EUR_UAH, HUF_UAH];
      break;
    case 'EUR':
      result = [EUR_USD, EUR_UAH, EUR_HUF, BTC_EUR];
      break;
    case 'USD':
      result = [USD_UAH, USD_HUF, EUR_USD, BTC_USD];
      break;
    case 'BTC':
      result = [BTC_USD, BTC_EUR];
      break;
    case 'HUF':
      result = [EUR_HUF, HUF_UAH, USD_HUF];
      break;
    default:
      result = [];
  }

  return result;
};
