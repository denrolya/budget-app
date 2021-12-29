import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useLocation, Routes, Route } from 'react-router-dom';

import BaseCurrencyContext from 'src/contexts/BaseCurrency';
import { getBrandText, routes } from 'src/services/routing';
import Layout from 'src/containers/Layout';
import { CURRENCIES } from 'src/constants/currency';

const App = ({ isAuthenticated, baseCurrency }) => {
  const { pathname } = useLocation();

  return (
    <>
      <Helmet>
        <title>
          {getBrandText(pathname)}
          {' '}
          | Budget
        </title>
      </Helmet>

      <BaseCurrencyContext.Provider value={CURRENCIES[baseCurrency]}>
        {isAuthenticated && (
          <Layout>
            <Routes>
              {routes.map(({ path, element: Element }) => (
                <Route key={path} path={path} element={<Element />} />
              ))}
            </Routes>
          </Layout>
        )}
      </BaseCurrencyContext.Provider>
    </>
  );
};

App.defaultProps = {
  isAuthenticated: false,
};

App.propTypes = {
  baseCurrency: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = ({ auth: { user, isAuthenticated } }) => ({
  isAuthenticated,
  baseCurrency: user.settings.baseCurrency,
});

export default connect(mapStateToProps)(
  memo(App, (pp, np) => pp.baseCurrency === np.baseCurrency && pp.isAuthenticated === np.isAuthenticated),
);
