import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import CategoriesContext from 'src/contexts/CategoriesContext';

const CategoriesProvider = ({ categories, children }) => (
  <CategoriesContext.Provider value={categories}>
    { children }
  </CategoriesContext.Provider>
);

CategoriesProvider.defaultProps = {
  categories: [],
};

CategoriesProvider.propTypes = {
  children: PropTypes.any.isRequired,
  categories: PropTypes.array,
};

const mapStateToProps = ({ category: { list: categories } }) => ({ categories });

export default connect(mapStateToProps)(CategoriesProvider);
