import { number, shape, string } from 'prop-types';

const debtType = shape({
  id: number.isRequired,
  debtor: string.isRequired,
  createdAt: string,
  balance: number,
  value: number,
  currency: string.isRequired,
});

export default debtType;
