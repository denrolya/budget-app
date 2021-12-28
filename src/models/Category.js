import { Record } from 'immutable';

const DEFAULT_VALUES = {
  id: undefined,
  name: undefined,
};

class Category extends Record(DEFAULT_VALUES) {}

export default Category;
