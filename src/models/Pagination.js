import { Record } from 'immutable';
import isNil from 'lodash/isNil';
import compact from 'lodash/compact';
import { stringify } from 'query-string';
import isEqual from 'lodash/isEqual';

export const DEFAULT_VALUES = {
  page: 1,
  perPage: 20,
  count: 0,
  filters: undefined,
  perPageOptions: [5, 10, 15, 20, 30, 50, 100],
};

class Pagination extends Record(DEFAULT_VALUES) {
  constructor(props) {
    let finalValues = { ...props };

    if (finalValues) {
      const {
        page, perPage, perPageOptions, count, filters,
      } = finalValues;

      finalValues = {
        filters,
        page: !isNil(page) ? page : DEFAULT_VALUES.page,
        perPage: !isNil(perPage) ? perPage : DEFAULT_VALUES.perPage,
        count: !isNil(count) ? count : 0,
        perPageOptions: !isNil(perPageOptions) ? perPageOptions : DEFAULT_VALUES.perPageOptions,
      };
    }

    super(finalValues);
  }

  setPage(page) {
    return this.set('page', page);
  }

  nextPage() {
    return this.set('page', this.page < this.countPages() ? this.page + 1 : this.page);
  }

  prevPage() {
    return this.set('page', this.page > 1 ? this.page - 1 : this.page);
  }

  isFirstPage() {
    return this.page === 1;
  }

  isLastPage() {
    return this.page === this.countPages();
  }

  countPages() {
    return this.count === 0 ? 1 : Math.ceil(this.count / this.perPage);
  }

  getParamsQuery() {
    const paginationQuery = stringify({
      page: this.page === DEFAULT_VALUES.page ? undefined : this.page,
      perPage: this.perPage === DEFAULT_VALUES.perPage ? undefined : this.perPage,
    });
    const filtersQuery = this.filters?.getParamsQuery();

    return compact([paginationQuery, filtersQuery]).join('&');
  }

  isEqual(compareTo) {
    return this.getParamsQuery() === compareTo.getParamsQuery();
  }
}

export default Pagination;
