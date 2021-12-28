import { number, object, oneOf, oneOfType, shape, string } from 'prop-types';

import { TRANSACTION_TYPES } from 'src/constants/transactions';
import accountType from 'src/types/account';
import categoryType from 'src/types/category';

const transactionType = shape({
  id: number.isRequired,
  amount: number.isRequired,
  value: number,
  account: oneOfType([accountType, string]),
  note: string,
  createdAt: oneOfType([string, object]),
  category: oneOfType([categoryType, string]),
  type: oneOf(TRANSACTION_TYPES).isRequired,
});

export default transactionType;
