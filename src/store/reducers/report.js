import { createReducer } from 'reduxsauce';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import { Types } from 'src/store/actions/report';
import { AVAILABLE_STATISTICS, INITIAL_STATE } from 'src/constants/report';

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
  [Types.SET_PERIOD]: (state = INITIAL_STATE, { startYear, endYear }) => {
    const newState = {
      ...state,
    };
    Object.keys(newState).forEach((key) => ({
      ...newState,
      [key]: newState[key].merge({
        from: newState[key].from.set('year', startYear),
        to: newState[key].to.set('year', endYear),
      }),
    }));

    return newState;
  },
  // eslint-disable-next-line default-param-last
  [Types.SET_STATISTICS]: (state = INITIAL_STATE, { name, newModel }) => ({
    ...state,
    [name]: newModel,
  }),
};

export default createReducer(INITIAL_STATE, HANDLERS);
