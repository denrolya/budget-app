import { createReducer } from 'reduxsauce';

import { Types } from 'src/store/actions/auth';

export const INITIAL_STATE = {
  isAuthenticated: false,
  user: undefined,
};

const logOutHandler = (state = INITIAL_STATE) => ({
  ...state,
  user: {},
  isAuthenticated: false,
});

const logInHandler = (state = INITIAL_STATE, { user }) => ({
  ...state,
  user,
  isAuthenticated: true,
});

const HANDLERS = {
  [Types.LOGIN_REQUEST]: logOutHandler,
  [Types.LOGIN_FAILURE]: logOutHandler,
  [Types.LOGOUT]: logOutHandler,
  [Types.LOGIN_SUCCESS]: logInHandler,
};

export default createReducer(INITIAL_STATE, HANDLERS);
