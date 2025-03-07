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

export const DEFAULT_VALUES = {
  types: [],
  from: moment().subtract(30, 'day'),
  to: moment(),
  accounts: [],
  categories: [],
  withNestedCategories: true,
  onlyDrafts: false,
};

class TransactionFilters extends Record(DEFAULT_VALUES) {
  constructor(props) {
    let finalValues = { ...props };

    if (finalValues) {
      const {
        types, from, to, categories, accounts, withNestedCategories, onlyDrafts,
      } = finalValues;

      finalValues = {
        types: TransactionFilters.normalize('types', types),
        from: TransactionFilters.normalize('from', from),
        to: TransactionFilters.normalize('to', to),
        accounts: TransactionFilters.normalize('accounts', accounts),
        categories: TransactionFilters.normalize('categories', categories),
        withNestedCategories: TransactionFilters.normalize('withNestedCategories', withNestedCategories),
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
    return this.accounts.filter((a) => a === account.id).length > 0;
  }

  toggleAccount(account) {
    return this.setAccounts(xor(this.accounts, [account.id]));
  }

  removeAccount(account) {
    return this.setAccounts(this.accounts.filter(({ id }) => id !== account.id));
  }

  setAccounts(value) {
    return this.set('accounts', TransactionFilters.normalize('accounts', value));
  }

  toggleCategory(category) {
    return this.setCategories(xor(this.categories, [category.id]));
  }

  removeCategory(category) {
    return this.setCategories(this.categories.filter(({ id }) => id !== category.id));
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

  static normalize(name, value) {
    if (isNil(value)) {
      return DEFAULT_VALUES[name];
    }

    switch (name) {
      case 'types':
        return !isEqual(value, TRANSACTION_TYPES) ? value : DEFAULT_VALUES.types;
      case 'from':
      case 'to':
        return !isMoment(value) ? moment(value, MOMENT_DATE_FORMAT) : value;
      case 'accounts':
      case 'categories':
        return uniq(value.map((el) => el?.id ? parseInt(el.id, 10) : el));
      default:
        return value;
    }
  }

  getParamsQuery() {
    const queryParams = {};

    Object.keys(DEFAULT_VALUES).forEach((name) => {
      if (['from', 'to'].includes(name) && !this.isDefault(name)) {
        queryParams[name] = this.get(name).format(MOMENT_DATE_FORMAT);
      } else if (!this.isDefault(name)) {
        queryParams[name] = this.get(name);
      }
    });

    return stringify(queryParams);
  }

  isDefault(name) {
    if (Array.isArray(this.get(name))) {
      return isEqual(sortBy(this.get(name)), sortBy(DEFAULT_VALUES[name]));
    }

    if (isMoment(this.get(name))) {
      return this.get(name).isSame(DEFAULT_VALUES[name]);
    }

    return isEqual(this.get(name), DEFAULT_VALUES[name]);
  }

  hasChanged() {
    return Object.keys(DEFAULT_VALUES).some((name) => !this.isDefault(name));
  }
}

export default TransactionFilters;
