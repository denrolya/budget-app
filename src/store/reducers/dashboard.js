import { createReducer } from 'reduxsauce';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import { Types } from 'src/store/actions/dashboard';
import { AVAILABLE_STATISTICS, INITIAL_STATE } from 'src/constants/dashboard';

const generateStatisticsHandlers = () =>
  AVAILABLE_STATISTICS.map((name) => ({
    [Types[`FETCH_STATISTICS_${upperCase(snakeCase(name))}_SUCCESS`]]: (state = INITIAL_STATE, action) => ({
      ...state,
      [name]: state[name].set('data', action[name]),
    }),
  })).reduce((acc, curr) => Object.assign(acc, curr), {});

const HANDLERS = {
  ...generateStatisticsHandlers(),
  [Types.SET_STATISTICS]: (state = INITIAL_STATE, { name, newModel }) => ({
    ...state,
    [name]: newModel,
  }),
  [Types.FETCH_STATISTICS_TRANSACTION_CATEGORIES_TIMELINE_SUCCESS]: (
    state = INITIAL_STATE,
    { transactionCategoriesTimeline },
  ) => ({
    ...state,
    transactionCategoriesTimeline: state.transactionCategoriesTimeline.setIn(
      'data.data'.split('.'),
      transactionCategoriesTimeline,
    ),
  }),
  [Types.FETCH_STATISTICS_MONEY_FLOW_SUCCESS]: (state = INITIAL_STATE, { moneyFlow }) => ({
    ...state,
    moneyFlow: state.moneyFlow.set('data', moneyFlow),
  }),
};

export default createReducer(INITIAL_STATE, HANDLERS);
