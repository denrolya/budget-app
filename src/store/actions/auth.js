import axios from 'src/services/http';
import { createActions } from 'reduxsauce';

import { ROUTE_LOGIN } from 'src/constants/routes';
import { getToken, isTokenPresentAndValid, parseJWT } from 'src/services/auth';
import Routing from 'src/services/routing';
import { RESET_ACTION } from 'src/store/actions/global';
import { setColorScheme } from 'src/store/actions/ui';
import history from 'src/services/history';

export const { Types, Creators } = createActions(
  {
    loginRequest: null,
    loginSuccess: ['user'],
    loginFailure: ['message'],
    logout: null,
  },
  { prefix: 'AUTH_' },
);

export const authorize = (token, shouldReset = true) => (dispatch) => {
  if (shouldReset) {
    dispatch({ type: RESET_ACTION });
  }

  const { from } = history.location.state || {
    from: { pathname: history.location.pathname },
  };

  localStorage.setItem('token', token);

  const user = parseJWT(token);
  dispatch(Creators.loginSuccess(user));

  if (user.settings.uiTheme) {
    dispatch(setColorScheme(user.settings.uiTheme));
  }

  if (shouldReset) {
    history.push(from.pathname);
  }
};

export const switchBaseCurrency = (currency) => (dispatch) => {
  dispatch(Creators.switchBaseCurrencyRequest());

  return axios
    .put(Routing.generate('api_v1_user_update_base_currency'), {
      currency,
    })
    .then((data) => {
      dispatch(Creators.switchBaseCurrencySuccess());
      dispatch(authorize(data.token));
    })
    .catch(({ message }) => dispatch(Creators.switchBaseCurrencyFailure(message)));
};

export const loginUser = ({ username, password }) => (dispatch) => {
  dispatch(Creators.loginRequest());

  return axios
    .post('/api/login_check', {
      username,
      password,
    })
    .then(({ data }) => dispatch(authorize(data.token)))
    .catch(({ message }) => dispatch(Creators.loginFailure(message)));
};

export const logoutUser = () => (dispatch) => {
  dispatch(Creators.logout());
  dispatch({ type: RESET_ACTION });
  history.push(ROUTE_LOGIN);
  localStorage.removeItem('token');
};

export const assertAuthorization = () => (dispatch) => {
  if (isTokenPresentAndValid()) {
    dispatch(authorize(getToken()));
  }
};
