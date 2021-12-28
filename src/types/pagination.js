import { number, shape, object } from 'prop-types';

const paginationType = shape({
  page: number.isRequired,
  perPage: number.isRequired,
  count: number.isRequired,
  filters: object,
});

export default paginationType;
