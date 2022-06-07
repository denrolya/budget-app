import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchList as fetchCategories } from 'src/store/actions/category';

import CategoriesContext from 'src/contexts/CategoriesContext';

const CategoriesProvider = ({ categories, fetchCategories, children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        setIsLoading(true);
      }
      try {
        await fetchCategories();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return null;
  }

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
