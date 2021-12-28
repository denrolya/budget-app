import { Record } from 'immutable';

const DEFAULT_VALUES = {
  id: undefined,
  name: undefined,
  symbol: undefined,
};

class Currency extends Record(DEFAULT_VALUES) {}

export default Currency;
