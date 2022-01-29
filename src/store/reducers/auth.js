import { createReducer } from 'reduxsauce';

import { Types } from 'src/store/actions/auth';
import { Types as UserTypes } from 'src/store/actions/user';

export const INITIAL_STATE = {
  isAuthenticated: false,
  user: undefined,
};

const logOutHandler = (state = INITIAL_STATE) => ({
  ...state,
  user: {},
  isAuthenticated: false,
});

// eslint-disable-next-line default-param-last
const switchCurrencyHandler = (state = INITIAL_STATE, { currency }) => ({
  ...state,
  user: {
    ...state.user,
    baseCurrency: currency,
  },
});

// eslint-disable-next-line default-param-last
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
  [UserTypes.SWITCH_BASE_CURRENCY_SUCCESS]: switchCurrencyHandler,
};

export default createReducer(INITIAL_STATE, HANDLERS);
