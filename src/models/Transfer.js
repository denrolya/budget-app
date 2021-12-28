import { List, Record } from 'immutable';
import moment from 'moment-timezone';

import { EXPENSE_TYPE, INCOME_TYPE, RETURN_TRANSACTION_CATEGORY_NAME } from 'src/constants/transactions';
import Account from 'src/models/Account';
import Category from 'src/models/Category';
import Transaction from 'src/models/Transaction';

const DEFAULT_VALUES = {
  id: undefined,
  account: undefined,
  from: Account,
  to: Account,
  amount: 0,
  rate: 0,
  fee: 0,
  feeExpense: undefined,
  note: '',
  executedAt: moment(),
};

class Transfer extends Record(DEFAULT_VALUES) {
  constructor(data) {
    if (data) {
      data.executedAt = moment(data.executedAt);
      data.from = data.from && new Account(data.from);
      data.to = data.to && new Account(data.to);
      data.feeExpense = data.feeExpense && new Transaction(data.feeExpense);
    }

    super(data);
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
      new Transfer({
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
}

export default Transfer;
