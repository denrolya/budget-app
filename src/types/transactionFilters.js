import { arrayOf, oneOfType, string } from 'prop-types';

import accountType from 'src/types/account';
import categoryType from 'src/types/category';

const transactionFiltersType = {
  from: string.isRequired,
  to: string.isRequired,
  accounts: arrayOf(oneOfType([accountType, string])).isRequired,
  categories: arrayOf(oneOfType([categoryType, string])),
};

export default transactionFiltersType;
