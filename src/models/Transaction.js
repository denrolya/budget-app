import { List, Record } from 'immutable';
import moment from 'moment-timezone';

import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { EXPENSE_TYPE, INCOME_TYPE, RETURN_TRANSACTION_CATEGORY_NAME } from 'src/constants/transactions';
import Account from 'src/models/Account';
import Category from 'src/models/Category';

const DEFAULT_VALUES = {
  id: undefined,
  type: EXPENSE_TYPE,
  account: undefined,
  amount: 0,
  value: 0,
  category: undefined,
  note: '',
  executedAt: moment(),
  compensations: new List(),
};

class Transaction extends Record(DEFAULT_VALUES) {
  constructor(data) {
    const constructorProps = {
      ...data,
    };

    if (constructorProps) {
      constructorProps.executedAt = moment(constructorProps.executedAt);
      constructorProps.account = constructorProps.account && new Account(constructorProps.account);
      constructorProps.category = constructorProps.category && new Category(constructorProps.category);
    }

    super(constructorProps);
  }

  setCategoryFromTypeahead(selected, field = 'category') {
    return this.setIn(field.split('.'), selected.length > 0 ? new Category(selected[0]) : null);
  }

  setAccountFromTypeahead(selected, field = 'account') {
    return this.setIn(field.split('.'), selected.length > 0 ? new Account(selected[0]) : null);
  }

  setExecutedAt(date, updateCompensations = false) {
    if (updateCompensations && List.isList(this.compensations)) {
      this.set(
        'compensations',
        this.compensations.map((compensation) => compensation.set('executedAt', moment(date))),
      );
    }

    return this.set('executedAt', moment(date));
  }

  addCompensation() {
    if (!List.isList(this.compensations)) {
      this.set('compensations', new List());
    }

    const compensations = this.compensations.push(
      new Transaction({
        category: {
          name: RETURN_TRANSACTION_CATEGORY_NAME,
        },
        type: INCOME_TYPE,
        executedAt: this.executedAt,
        note: `[Compensation]: ${this.note}`,
      }),
    );

    return this.set('compensations', compensations);
  }

  removeCompensation(key) {
    if (!List.isList(this.compensations)) {
      return this;
    }

    return this.set('compensations', this.compensations.remove(key));
  }

  isExpense() {
    return this.type === EXPENSE_TYPE;
  }

  toEditableModel() {
    return {
      ...this.toJS(),
      executedAt: this.executedAt.format(MOMENT_DATETIME_FORMAT),
    };
  }
}

export default Transaction;
