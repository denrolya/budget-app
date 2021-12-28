import { Record } from 'immutable';

import Currency from 'src/models/Currency';

const DEFAULT_VALUES = {
  id: undefined,
  name: undefined,
  currency: new Currency(),
  type: undefined,
  icon: undefined,
  color: undefined,
};

class Account extends Record(DEFAULT_VALUES) {}

export default Account;
