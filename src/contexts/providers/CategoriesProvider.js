import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchList as fetchCategories } from 'src/store/actions/category';

import CategoriesContext from 'src/contexts/CategoriesContext';

const CategoriesProvider = ({ categories, fetchCategories, children }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCategories();
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  return (
    <CategoriesContext.Provider value={categories}>
      { children }
    </CategoriesContext.Provider>
  );
};

CategoriesProvider.defaultProps = {
  categories: [],
};

CategoriesProvider.propTypes = {
  fetchCategories: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  categories: PropTypes.array,
};

const mapStateToProps = ({ category: { list: categories } }) => ({ categories });

export default connect(mapStateToProps, {
  fetchCategories,
})(CategoriesProvider);
