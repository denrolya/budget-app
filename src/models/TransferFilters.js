import { Record } from 'immutable';
import isEqual from 'lodash/isEqual';
import has from 'lodash/has';
import sortBy from 'lodash/sortBy';
import isNil from 'lodash/isNil';
import moment from 'moment-timezone';
import { stringify } from 'query-string';

export const DEFAULT_VALUES = {
  from: moment().startOf('month'),
  to: moment().endOf('month'),
  accounts: [],
  withCanceled: false,
};

class TransferFilters extends Record(DEFAULT_VALUES) {
  constructor(props) {
    let finalValues = { ...props };

    if (finalValues) {
      const {
        from, to, accounts, withCanceled,
      } = finalValues;

      finalValues = {
        from: TransferFilters.normalize('from', from),
        to: TransferFilters.normalize('to', to),
        accounts: TransferFilters.normalize('accounts', accounts),
        withCanceled: TransferFilters.normalize('withCanceled', withCanceled),
      };
    }

    super(finalValues);
  }

  setFilter(key, value) {
    return this.set(key, value);
  }

  setFilters(filters) {
    return this.merge(filters);
  }

  setAccounts(value) {
    return this.set('accounts', TransferFilters.normalize('accounts', value));
  }

  setFrom(value) {
    return this.set('from', TransferFilters.normalize('from', value));
  }

  setTo(value) {
    return this.set('to', TransferFilters.normalize('to', value));
  }

  setFromTo(from, to) {
    return this.merge({
      from: TransferFilters.normalize('from', from),
      to: TransferFilters.normalize('to', to),
    });
  }

  static normalize(name, value) {
    if (isNil(value)) {
      return DEFAULT_VALUES[name];
    }

    switch (name) {
      case 'from':
      case 'to':
        return value;
      case 'accounts':
        return value.map((el) => (has(el, 'name') ? el.name : el));
      default:
        return value;
    }
  }

  getParamsQuery() {
    const queryParams = {};

    Object.keys(DEFAULT_VALUES).forEach((name) => {
      if (!this.isDefault(name)) {
        queryParams[name] = this.get(name);
      }
    });

    return stringify(queryParams);
  }

  isDefault(name) {
    return Array.isArray(this.get(name))
      ? isEqual(sortBy(this.get(name)), sortBy(DEFAULT_VALUES[name]))
      : isEqual(this.get(name), DEFAULT_VALUES[name]);
  }
}

export default TransferFilters;
