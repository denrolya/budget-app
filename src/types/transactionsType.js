import { oneOf } from 'prop-types';

import { TRANSACTION_TYPES } from 'src/constants/transactions';

const transactionsTypeType = oneOf(TRANSACTION_TYPES);

export default transactionsTypeType;
