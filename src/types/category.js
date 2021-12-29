import {
  bool, number, shape, string,
} from 'prop-types';

import transactionsTypeType from 'src/types/transactionsType';

const categoryType = shape({
  id: number,
  name: string.isRequired,
  type: transactionsTypeType,
  is_technical: bool,
});

export default categoryType;
