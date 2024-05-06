import moment from 'moment-timezone';

import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';

class Transaction {
  type = EXPENSE_TYPE;

  constructor(data, accounts, categories) {
    // Assign all data properties to this instance
    Object.assign(this, data);

    // Process executedAt field and convert it into a moment object
    if (data.executedAt) {
      this.executedAt = moment(data.executedAt);
    }

    if (data.account?.id) {
      this.account = accounts.find((a) => a.id === data.account.id);
    }

    if (data.category?.id) {
      this.category = categories.find((c) => c.id === data.category.id);
    }
  }

  isExpense() {
    return this.type === EXPENSE_TYPE;
  }

  isIncome() {
    return this.type === INCOME_TYPE;
  }
}

export default Transaction;
