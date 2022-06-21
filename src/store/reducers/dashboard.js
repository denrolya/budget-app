import { createReducer } from 'reduxsauce';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import { Types } from 'src/store/actions/dashboard';
import { AVAILABLE_STATISTICS, INITIAL_STATE } from 'src/constants/dashboard';

const generateStatisticsHandlers = () => AVAILABLE_STATISTICS
  .map(({ name }) => ({
  // eslint-disable-next-line default-param-last
    [Types[`FETCH_STATISTICS_${upperCase(snakeCase(name))}_SUCCESS`]]: (state = INITIAL_STATE, action) => ({
      ...state,
      [name]: state[name].set('data', action[name]),
    }),
  }))
  .reduce((acc, curr) => Object.assign(acc, curr), {});

const HANDLERS = {
  ...generateStatisticsHandlers(),
  // eslint-disable-next-line default-param-last
  [Types.SET_STATISTICS]: (state = INITIAL_STATE, { name, newModel }) => ({
    ...state,
    [name]: newModel,
  }),
  // eslint-disable-next-line default-param-last
  [Types.FETCH_STATISTICS_CATEGORIES_TIMELINE_SUCCESS]: (state = INITIAL_STATE, { categoriesTimeline }) => ({
    ...state,
    categoriesTimeline: state.categoriesTimeline.setIn(
      'data.data'.split('.'),
      categoriesTimeline,
    ),
  }),
  // eslint-disable-next-line default-param-last
  [Types.FETCH_STATISTICS_MONEY_FLOW_SUCCESS]: (state = INITIAL_STATE, { moneyFlow }) => ({
    ...state,
    moneyFlow: state.moneyFlow.set('data', moneyFlow),
  }),
};

export default createReducer(INITIAL_STATE, HANDLERS);
