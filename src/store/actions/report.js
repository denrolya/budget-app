import axios from 'src/services/http';
import camelCase from 'voca/camel_case';
import capitalize from 'voca/capitalize';
import { createActions } from 'reduxsauce';

import { MOMENT_DATETIME_FORMAT } from 'src/constants/datetime';
import { generateCategoriesStatisticsTree, generatePreviousPeriod } from 'src/services/common';

export const AVAILABLE_STATISTICS = [
  'moneyFlow',
  'mainIncomeSource',
  'mainExpenseCategoriesReview',
  'newIncomeCategories',
  'newExpenseCategories',
  'totalIncomeExpense',
  'foodExpenses',
  'foodExpensesMinMax',
  'expenseCategoriesTree',
  'groceriesAverage',
  'accountExpenseDistribution',
  'expenseCategoriesByWeekdays',
  'utilityCostsByInterval',
  'totalExpensesByInterval',
];

export const { Types, Creators } = createActions({
  ...AVAILABLE_STATISTICS.map((name) => ({
    [`fetchStatistics${capitalize(camelCase(name))}Request`]: null,
    [`fetchStatistics${capitalize(camelCase(name))}Success`]: [`${name}`],
    [`fetchStatistics${capitalize(camelCase(name))}Failure`]: ['message'],
  })).reduce((acc, curr) => Object.assign(acc, curr), {}),

  setStatistics: ['name', 'newModel'],
  setPeriod: ['startYear', 'endYear'],
}, { prefix: 'REPORT_' });

export const setPeriod = (startYear, endYear) => (dispatch) => {
  dispatch(Creators.setPeriod(startYear, endYear));
  dispatch(updateReport());
};

export const setStatistics = (name, newModel) => (dispatch) => {
  dispatch(Creators.setStatistics(name, newModel));
  dispatch(fetchStatistics(name));
};

export const fetchStatistics = (name) => (dispatch, getState) => {
  const state = getState().report[name];
  const params = {
    'executedAt[after]': state.from.format(MOMENT_DATETIME_FORMAT),
    'executedAt[before]': state.to.format(MOMENT_DATETIME_FORMAT),
    interval: state.interval,
  };

  if (customHandlers[name]) {
    dispatch(customHandlers[name]());
  }

  dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Request`]());

  try {
    const { data } = axios.get('', { params });
    dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Success`](data));
  } catch (e) {
    dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Failure`](e));
  }
};

const customHandlers = {
  expenseCategoriesTree: (path, params) => async (dispatch, getState) => {
    dispatch(Creators.fetchStatisticsExpenseCategoriesTreeRequest());

    const getSelectedPeriodDataRequest = axios.get(path, { params });

    const { from, to } = getState().dashboard.expenseCategoriesTree;
    const previousPeriod = generatePreviousPeriod(from, to);

    const getPreviousPeriodDataRequest = axios.get(path, {
      params: {
        ...params,
        'executedAt[after]': previousPeriod.from.format(MOMENT_DATETIME_FORMAT),
        'executedAt[before]': previousPeriod.to.format(MOMENT_DATETIME_FORMAT),
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

export const updateReport = () => (dispatch) => AVAILABLE_STATISTICS.map((name) => dispatch(fetchStatistics(name)));
