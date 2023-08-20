import { createActions } from 'reduxsauce';
import camelCase from 'voca/camel_case';
import capitalize from 'voca/capitalize';

import { EXPENSE_TYPE } from 'src/constants/transactions';
import { generatePreviousPeriod } from 'src/utils/datetime';
import axios from 'src/utils/http';
import { notify } from 'src/store/actions/global';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { generateCategoriesStatisticsTree } from 'src/utils/category';
import { AVAILABLE_STATISTICS } from 'src/constants/dashboard';

export const { Types, Creators } = createActions(
  {
    ...AVAILABLE_STATISTICS.map(({ name }) => ({
      [`fetchStatistics${capitalize(camelCase(name))}Request`]: null,
      [`fetchStatistics${capitalize(camelCase(name))}Success`]: [name],
      [`fetchStatistics${capitalize(camelCase(name))}Failure`]: ['error'],
    })).reduce((acc, curr) => Object.assign(acc, curr), {}),
    fetchStatisticsDailyExpensesRequest: null,
    fetchStatisticsDailyExpensesSuccess: ['dailyExpenses'],
    fetchStatisticsDailyExpensesFailure: ['error'],
    setStatistics: ['name', 'newModel'],
  },
  { prefix: 'DASHBOARD_' },
);

export const setStatistics = (name, newModel) => (dispatch) => {
  dispatch(Creators.setStatistics(name, newModel));
  dispatch(fetchStatistics(AVAILABLE_STATISTICS.find((el) => el.name === name)));
};

export const fetchNewStatistics = ({
  name, path, params,
}) => async (dispatch) => {
  let result;
  dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Request`]());

  try {
    const { data } = await axios.get(path, { params });
    result = data?.['hydra:member']?.[0];
  } catch (e) {
    notify('error', `[Error]: Fetch Statistics(${name})`);
    dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Failure`](e));
    return null;
  }

  dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Success`]());
  return result;
};

/**
 * @deprecated since version 2.0
 */
export const fetchStatistics = ({
  name, path, additionalParams, fetchPreviousPeriod,
}) => async (dispatch, getState) => {
  const state = getState().dashboard[name];
  let params = {
    'executedAt[after]': state.from.format(MOMENT_DATETIME_FORMAT),
    'executedAt[before]': state.to.format(MOMENT_DATETIME_FORMAT),
    interval: state.interval,
  };
  let result;

  if (additionalParams) {
    params = {
      ...params,
      ...additionalParams,
    };
  }

  if (customHandlers[name]) {
    dispatch(customHandlers[name](path, params));
  }

  dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Request`]());

  try {
    if (fetchPreviousPeriod) {
      const getSelectedPeriodDataRequest = axios.get(path, { params });
      const previousPeriod = generatePreviousPeriod(state.from, state.to);

      const getPreviousPeriodDataRequest = axios.get(path, {
        params: {
          ...params,
          'executedAt[after]': previousPeriod.from.format(MOMENT_DATETIME_FORMAT),
          'executedAt[before]': previousPeriod.to.format(MOMENT_DATETIME_FORMAT),
        },
      });

      const [currentResponse, previousResponse] = await axios.all([getSelectedPeriodDataRequest, getPreviousPeriodDataRequest]);

      result = {
        current: currentResponse.data?.['hydra:member'][0],
        previous: previousResponse.data?.['hydra:member'][0],
      };
    } else {
      const { data } = await axios.get(path, { params });
      result = data?.['hydra:member']?.[0];
    }
  } catch (e) {
    notify('error', `[Error]: Fetch Statistics(${name})`);
    dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Failure`](e));
  }

  dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Success`](result));
  return result;
};

const customHandlers = {
  categoriesTimeline: (path, params) => async (dispatch, getState) => {
    const { data: { categories } } = getState().dashboard.categoriesTimeline;
    dispatch(Creators.fetchStatisticsCategoriesTimelineRequest());

    try {
      const { data } = await axios.get(path, {
        params: {
          ...params,
          categoryDeep: categories,
        },
      });

      dispatch(Creators.fetchStatisticsCategoriesTimelineSuccess(data['hydra:member'][0]));
    } catch (e) {
      dispatch(Creators.fetchStatisticsCategoriesTimelineFailure(e));
    }
  },
  expenseCategoriesTree: (path, params) => async (dispatch, getState) => {
    dispatch(Creators.fetchStatisticsExpenseCategoriesTreeRequest());

    const getSelectedPeriodDataRequest = axios.get(path, {
      params: {
        type: EXPENSE_TYPE,
        'transactions.executedAt[after]': params['executedAt[after]'],
        'transactions.executedAt[before]': params['executedAt[before]'],
      },
    });

    const previousPeriod = getState().dashboard.expenseCategoriesTree.generatePreviousPeriod();

    const getPreviousPeriodDataRequest = axios.get(path, {
      params: {
        type: EXPENSE_TYPE,
        'transactions.executedAt[after]': previousPeriod.from.format(MOMENT_DATETIME_FORMAT),
        'transactions.executedAt[before]': previousPeriod.to.format(MOMENT_DATETIME_FORMAT),
      },
    });

    try {
      const [current, previous] = await axios.all([getSelectedPeriodDataRequest, getPreviousPeriodDataRequest]);
      const currentPeriodData = current.data?.['hydra:member'][0];
      const previousPeriodData = previous.data?.['hydra:member'][0];

      dispatch(
        Creators.fetchStatisticsExpenseCategoriesTreeSuccess(
          generateCategoriesStatisticsTree(currentPeriodData, previousPeriodData),
        ),
      );
    } catch (e) {
      dispatch(Creators.fetchStatisticsExpenseCategoriesTreeFailure(e));
    }
  },
};

export const updateDashboard = () => (dispatch) => AVAILABLE_STATISTICS.forEach((el) => dispatch(fetchStatistics(el)));
