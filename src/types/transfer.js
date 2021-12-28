import { number, shape, string } from 'prop-types';

import accountType from 'src/types/account';

const transferType = shape({
  id: number,
  amount: number,
  from: accountType.isRequired,
  to: accountType.isRequired,
  note: string,
  createdAt: string,
  rate: number,
  fee: number,
});

export default transferType;
