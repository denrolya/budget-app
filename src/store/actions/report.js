import axios from 'src/utils/http';
import camelCase from 'voca/camel_case';
import capitalize from 'voca/capitalize';
import { createActions } from 'reduxsauce';

import { EXPENSE_TYPE, INCOME_TYPE } from 'src/constants/transactions';
import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { AVAILABLE_STATISTICS } from 'src/constants/report';

import { generateCategoriesStatisticsTree } from 'src/utils/category';
import { generatePreviousPeriod } from 'src/utils/datetime';

export const { Types, Creators } = createActions({
  ...AVAILABLE_STATISTICS.map(({ name }) => ({
    [`fetchStatistics${capitalize(camelCase(name))}Request`]: null,
    [`fetchStatistics${capitalize(camelCase(name))}Success`]: [`${name}`],
    [`fetchStatistics${capitalize(camelCase(name))}Failure`]: ['message'],
  })).reduce((acc, curr) => Object.assign(acc, curr), {}),

  setStatistics: ['name', 'newModel'],
  setPeriod: ['startYear', 'endYear'],
}, { prefix: 'REPORT_' });

export const setPeriod = (startYear, endYear) => (dispatch) => dispatch(Creators.setPeriod(startYear, endYear));

export const setStatistics = (name, newModel) => (dispatch) => {
  dispatch(Creators.setStatistics(name, newModel));
  dispatch(fetchStatistics(name));
};

export const fetchStatistics = ({
  name, path, additionalParams, fetchPreviousPeriod,
}) => async (dispatch, getState) => {
  const state = getState().report[name];
  let params = {
    'executedAt[after]': state.from.format(MOMENT_DATETIME_FORMAT),
    'executedAt[before]': state.to.format(MOMENT_DATETIME_FORMAT),
    interval: state.interval,
  };

  if (additionalParams) {
    params = {
      ...params,
      ...additionalParams,
    };
  }

  if (customHandlers[name]) {
    dispatch(customHandlers[name](path, params));
    return;
  }

  dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Request`]());

  try {
    if (fetchPreviousPeriod) {
      const getSelectedPeriodDataRequest = axios.get(path, { params });

      const { from, to } = getState().report.expenseCategoriesTree;
      const previousPeriod = generatePreviousPeriod(from, to);

      const getPreviousPeriodDataRequest = axios.get(path, {
        params: {
          ...params,
          'executedAt[after]': previousPeriod.from.format(MOMENT_DATETIME_FORMAT),
          'executedAt[before]': previousPeriod.to.format(MOMENT_DATETIME_FORMAT),
        },
      });

      const [currentResponse, previousResponse] = await axios.all([getSelectedPeriodDataRequest, getPreviousPeriodDataRequest]);

      dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Success`]({
        current: currentResponse.data?.['hydra:member'][0],
        previous: previousResponse.data?.['hydra:member'][0],
      }));
    } else {
      const { data } = await axios.get(path, { params });
      dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Success`](data?.['hydra:member']?.[0]));
    }
  } catch (e) {
    dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Failure`](e));
  }
};

const customHandlers = {
  expenseCategoriesTree: (path, params) => async (dispatch, getState) => {
    dispatch(Creators.fetchStatisticsExpenseCategoriesTreeRequest());

    const getSelectedPeriodDataRequest = axios.get(path, {
      params: {
        type: EXPENSE_TYPE,
        'transactions.executedAt[after]': params['executedAt[after]'],
        'transactions.executedAt[before]': params['executedAt[before]'],
      },
    });

    const { from, to } = getState().report.expenseCategoriesTree;
    const previousPeriod = generatePreviousPeriod(from, to);

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
  incomeCategoriesTree: (path, params) => async (dispatch, getState) => {
    dispatch(Creators.fetchStatisticsIncomeCategoriesTreeRequest());

    const getSelectedPeriodDataRequest = axios.get(path, {
      params: {
        type: INCOME_TYPE,
        'transactions.executedAt[after]': params['executedAt[after]'],
        'transactions.executedAt[before]': params['executedAt[before]'],
      },
    });

    const { from, to } = getState().report.expenseCategoriesTree;
    const previousPeriod = generatePreviousPeriod(from, to);

    const getPreviousPeriodDataRequest = axios.get(path, {
      params: {
        type: INCOME_TYPE,
        'transactions.executedAt[after]': previousPeriod.from.format(MOMENT_DATETIME_FORMAT),
        'transactions.executedAt[before]': previousPeriod.to.format(MOMENT_DATETIME_FORMAT),
      },
    });

    try {
      const [current, previous] = await axios.all([getSelectedPeriodDataRequest, getPreviousPeriodDataRequest]);
      const currentPeriodData = current.data?.['hydra:member'][0];
      const previousPeriodData = previous.data?.['hydra:member'][0];

      dispatch(
        Creators.fetchStatisticsIncomeCategoriesTreeSuccess(
          generateCategoriesStatisticsTree(currentPeriodData, previousPeriodData),
        ),
      );
    } catch (e) {
      dispatch(Creators.fetchStatisticsIncomeCategoriesTreeFailure(e));
    }
  },
};

export const updateReport = () => (dispatch) => AVAILABLE_STATISTICS.map((el) => dispatch(fetchStatistics(el)));
