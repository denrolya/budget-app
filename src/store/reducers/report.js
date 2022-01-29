import { createReducer } from 'reduxsauce';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import { INITIAL_STATE } from 'src/constants/report';
import { AVAILABLE_STATISTICS, Types } from 'src/store/actions/report';

const generateStatisticsHandlers = () => AVAILABLE_STATISTICS.map((name) => ({
  // eslint-disable-next-line default-param-last
  [Types[`FETCH_STATISTICS_${upperCase(snakeCase(name))}_SUCCESS`]]: (state = INITIAL_STATE, action) => ({
    ...state,
    [name]: state[name].set('data', action[name]),
  }),
})).reduce((acc, curr) => Object.assign(acc, curr), {});

const HANDLERS = {
  ...generateStatisticsHandlers(),
  // eslint-disable-next-line default-param-last
  [Types.SET_PERIOD]: (state = INITIAL_STATE, { startYear, endYear }) => {
    Object.keys(state).forEach((key) => ({
      ...state,
      [key]: state[key].merge({
        from: state[key].from.set('year', startYear),
        to: state[key].to.set('year', endYear),
      }),
    }));
  },
  // eslint-disable-next-line default-param-last
  [Types.FETCH_STATISTICS_MONEY_FLOW_SUCCESS]: (state = INITIAL_STATE, { moneyFlow }) => ({
    ...state,
    moneyFlow: state.moneyFlow.set('data', moneyFlow),
  }),
  // eslint-disable-next-line default-param-last
  [Types.SET_STATISTICS]: (state = INITIAL_STATE, { name, newModel }) => ({
    ...state,
    [name]: newModel,
  }),
};

export default createReducer(INITIAL_STATE, HANDLERS);
