import { number, shape, string } from 'prop-types';

const accountType = shape({
  id: number.isRequired,
  name: string.isRequired,
  balance: number,
  currency: string.isRequired,
});

export default accountType;
