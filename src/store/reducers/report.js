import { createReducer } from 'reduxsauce';
import snakeCase from 'voca/snake_case';
import upperCase from 'voca/upper_case';

import { INITIAL_STATE } from 'src/constants/report';
import { AVAILABLE_STATISTICS, Types } from 'src/store/actions/report';

const generateStatisticsHandlers = () =>
  AVAILABLE_STATISTICS.map((name) => ({
    [Types.SET_PERIOD]: (state = INITIAL_STATE, { startYear, endYear }) => {
      const { statistics } = state;
      Object.keys(statistics).forEach((key) => {
        statistics[key] = statistics[key].merge({
          from: statistics[key].from.set('year', startYear),
          to: statistics[key].to.set('year', endYear),
        });
      });

      return {
        ...state,
        statistics,
      };
    },
    [Types[`FETCH_STATISTICS_${upperCase(snakeCase(name))}_SUCCESS`]]: (state = INITIAL_STATE, action) => ({
      ...state,
      statistics: {
        ...state.statistics,
        [name]: state.statistics[name].set('data', action[name]),
      },
    }),
    [Types.FETCH_STATISTICS_MONEY_FLOW_SUCCESS]: (state = INITIAL_STATE, { moneyFlow }) => ({
      ...state,
      statistics: {
        ...state.statistics,
        moneyFlow: state.statistics.moneyFlow.set('data', moneyFlow),
      },
    }),
  }))
    .concat([
      {
        [Types.SET_STATISTICS]: (state = INITIAL_STATE, { name, newModel }) => ({
          ...state,
          statistics: {
            ...state.statistics,
            [name]: newModel,
          },
        }),
      },
    ])
    .reduce((acc, curr) => Object.assign(acc, curr), {});

const HANDLERS = generateStatisticsHandlers();

export default createReducer(INITIAL_STATE, HANDLERS);
