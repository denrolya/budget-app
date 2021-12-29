import { Record } from 'immutable';
import xor from 'lodash/xor';
import uniq from 'lodash/uniq';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import isNil from 'lodash/isNil';
import moment, { isMoment } from 'moment-timezone';
import { stringify } from 'query-string';

import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { TRANSACTION_TYPES } from 'src/constants/transactions';
import { getQueryParam } from 'src/services/routing';

export const DEFAULT_VALUES = {
  types: [],
  from: moment().startOf('month').format(MOMENT_DATE_FORMAT),
  to: moment().endOf('month').format(MOMENT_DATE_FORMAT),
  accounts: [],
  categories: [],
  withCanceled: false,
  onlyDrafts: false,
};

class TransactionFilters extends Record(DEFAULT_VALUES) {
  constructor(props) {
    let finalValues = { ...props };

    if (finalValues) {
      const {
        types, from, to, categories, accounts, withCanceled, onlyDrafts,
      } = finalValues;

      finalValues = {
        types: TransactionFilters.normalize('types', types),
        from: TransactionFilters.normalize('from', from),
        to: TransactionFilters.normalize('to', to),
        categories: TransactionFilters.normalize('categories', categories),
        accounts: TransactionFilters.normalize('accounts', accounts),
        withCanceled: TransactionFilters.normalize('withCanceled', withCanceled),
        onlyDrafts: TransactionFilters.normalize('onlyDrafts', onlyDrafts),
      };
    }

    super(finalValues);
  }

  toggleType(type) {
    return this.set('types', xor(this.types, [type]));
  }

  hasType(type) {
    return this.types.includes(type);
  }

  setFilter(key, value) {
    return this.set(key, value);
  }

  setFilters(filters) {
    return this.merge(filters);
  }

  hasAccount(account) {
    return this.accounts.filter((a) => a === account.name).length > 0;
  }

  toggleAccount(account) {
    return this.setAccounts(xor(this.accounts, [account.name]));
  }

  removeAccount(account) {
    return this.setAccounts(this.accounts.filter(({ name }) => name !== account.name));
  }

  setAccounts(value) {
    return this.set('accounts', TransactionFilters.normalize('accounts', value));
  }

  toggleCategory(category) {
    return this.setCategories([...this.categories, category]);
  }

  removeCategory(category) {
    return this.setCategories(this.categories.filter(({ name }) => name !== category.name));
  }

  setCategories(value) {
    return this.set('categories', TransactionFilters.normalize('categories', value));
  }

  setFrom(value) {
    return this.set('from', TransactionFilters.normalize('from', value));
  }

  setTo(value) {
    return this.set('to', TransactionFilters.normalize('to', value));
  }

  setFromTo(from, to) {
    return this.merge({
      from: TransactionFilters.normalize('from', from),
      to: TransactionFilters.normalize('to', to),
    });
  }

  parseFromQueryString() {
    return {
      types: getQueryParam('types', (v) => (Array.isArray(v) ? v : [v])),
      from: getQueryParam('from'),
      to: getQueryParam('to'),
      accounts: getQueryParam('accounts', (v) => (Array.isArray(v) ? v : [v])),
      categories: getQueryParam('categories', (v) => (Array.isArray(v) ? v : [v])),
      withCanceled: getQueryParam('withCanceled', (v) => v === 'true'),
      onlyDrafts: getQueryParam('onlyDrafts', (v) => v === 'true'),
    };
  }

  static normalize(name, value) {
    if (isNil(value)) {
      return DEFAULT_VALUES[name];
    }

    switch (name) {
      case 'types':
        return !isEqual(value, TRANSACTION_TYPES) ? value : DEFAULT_VALUES.types;
      case 'from':
      case 'to':
        return isMoment(value) ? value.format(MOMENT_DATE_FORMAT) : value;
      case 'accounts':
      case 'categories':
        return uniq(value.map((el) => el?.name || el));
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

export default TransactionFilters;
