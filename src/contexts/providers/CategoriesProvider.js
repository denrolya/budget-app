import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { fetchList as fetchCategories } from 'src/store/actions/category';

import CategoriesContext from 'src/contexts/CategoriesContext';

const CategoriesProvider = ({ fetchCategories, children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      setCategories(
        await fetchCategories(),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const providerValue = useMemo(() => ({
    income: categories.filter(({ type }) => type === 'income'),
    expense: categories.filter(({ type }) => type === 'expense'),
    categories,
  }), [categories]);

  if (isLoading) {
    return null;
  }

  return (
    <CategoriesContext.Provider value={providerValue}>
      { children }
    </CategoriesContext.Provider>
  );
};

CategoriesProvider.propTypes = {
  fetchCategories: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};

export default connect(null, {
  fetchCategories,
})(CategoriesProvider);
