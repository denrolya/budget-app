import {
  arrayOf, number, shape, string,
} from 'prop-types';

const expenseCategoriesStatisticsType = {
  from: string.isRequired,
  to: string.isRequired,
  data: arrayOf(
    shape({
      name: string.isRequired,
      amount: number.isRequired,
    }),
  ).isRequired,
  selectedCategory: string,
};

export default expenseCategoriesStatisticsType;
