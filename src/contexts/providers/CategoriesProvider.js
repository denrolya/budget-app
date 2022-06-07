import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { fetchList as fetchCategories } from 'src/store/actions/category';

import CategoriesContext from 'src/contexts/CategoriesContext';

const CategoriesProvider = ({ categories, fetchCategories, children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await fetchCategories();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = useMemo(() => ({
    income: categories.filter(({ type }) => type === 'income'),
    expense: categories.filter(({ type }) => type === 'expense'),
    categories,
  }), [categories]);

  if (isLoading) {
    return null;
  }

  return (
    <CategoriesContext.Provider value={data}>
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
