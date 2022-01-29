import axios from 'src/services/http';
import { createActions } from 'reduxsauce';

import { ROUTE_LOGIN } from 'src/constants/routes';
import {
  getToken, getUser, isTokenPresentAndValid, parseJWT, setToken, setUser,
} from 'src/services/auth';
import { RESET_ACTION } from 'src/store/actions/global';
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

  setToken(token);

  let user = getUser();

  if (!user) {
    user = parseJWT(token);
    setUser(user);
  }

  dispatch(Creators.loginSuccess(user));

  if (shouldReset) {
    history.push(from.pathname);
  }
};

export const loginUser = ({ username, password }) => async (dispatch) => {
  dispatch(Creators.loginRequest());

  try {
    const { data } = await axios.post('/api/login_check', {
      username,
      password,
    });
    dispatch(authorize(data.token));
  } catch (e) {
    dispatch(Creators.loginFailure(e));
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(Creators.logout());
  dispatch({ type: RESET_ACTION });
  history.push(ROUTE_LOGIN);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const assertAuthorization = () => (dispatch) => {
  if (isTokenPresentAndValid()) {
    dispatch(authorize(getToken()));
  }
};
