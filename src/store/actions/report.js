import axios from 'src/services/http';
import camelCase from 'voca/camel_case';
import capitalize from 'voca/capitalize';
import snakeCase from 'voca/snake_case';
import { createActions } from 'reduxsauce';

import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import Routing from 'src/services/routing';
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

export const { Types, Creators } = createActions(
  AVAILABLE_STATISTICS.map((name) => ({
    [`fetchStatistics${capitalize(camelCase(name))}Request`]: null,
    [`fetchStatistics${capitalize(camelCase(name))}Success`]: [`${name}`],
    [`fetchStatistics${capitalize(camelCase(name))}Failure`]: ['message'],
  }))
    .concat([
      {
        setStatistics: ['name', 'newModel'],
        setPeriod: ['startYear', 'endYear'],
      },
    ])
    .reduce((acc, curr) => Object.assign(acc, curr), {}),
  { prefix: 'REPORT_' },
);

export const setPeriod = (startYear, endYear) => (dispatch) => {
  dispatch(Creators.setPeriod(startYear, endYear));
  dispatch(updateReport());
};

export const setStatistics = (name, newModel) => (dispatch) => {
  dispatch(Creators.setStatistics(name, newModel));
  dispatch(fetchStatistics(name));
};

export const fetchStatistics = (name) => (dispatch, getState) => {
  if (customHandlers[name]) {
    return dispatch(customHandlers[name]());
  }

  dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Request`]());

  const state = getState().report.statistics[name];
  const requestParams = {};

  if (state instanceof TimeperiodStatistics) {
    requestParams.from = state.from.format(MOMENT_DATE_FORMAT);
    requestParams.to = state.to.format(MOMENT_DATE_FORMAT);
  } else if (state instanceof TimeperiodIntervalStatistics) {
    requestParams.from = state.from.format(MOMENT_DATE_FORMAT);
    requestParams.to = state.to.format(MOMENT_DATE_FORMAT);
    requestParams.interval = state.interval;
  }

  axios
    .get(Routing.generate(`api_v1_statistics_${snakeCase(name)}`, requestParams))
    .then(({ data }) => dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Success`](data)))
    .catch((e) => {
      console.error(e);
      dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Failure`](e.message));
    });
};

const customHandlers = {
  expenseCategoriesTree: () => (dispatch, getState) => {
    const { from, to } = getState().report.statistics.expenseCategoriesTree;

    dispatch(Creators.fetchStatisticsExpenseCategoriesTreeRequest());

    const getSelectedPeriodDataRequest = axios.get(
      Routing.generate('api_v1_statistics_expense_categories_tree', {
        from: from.format(MOMENT_DATE_FORMAT),
        to: to.format(MOMENT_DATE_FORMAT),
      }),
    );

    const previousPeriod = generatePreviousPeriod(from, to);

    const getPreviousPeriodDataRequest = axios.get(
      Routing.generate('api_v1_statistics_expense_categories_tree', previousPeriod),
    );

    axios
      .all([getSelectedPeriodDataRequest, getPreviousPeriodDataRequest])
      .then(
        axios.spread((...responses) => {
          const currentPeriodData = responses[0].data;
          const previousPeriodData = responses[1].data;

          dispatch(
            Creators.fetchStatisticsExpenseCategoriesTreeSuccess(
              generateCategoriesStatisticsTree(currentPeriodData, previousPeriodData),
            ),
          );
        }),
      )
      .catch((e) => {
        console.error(e);
        dispatch(Creators.fetchStatisticsExpenseCategoriesTreeFailure(e.message));
      });
  },
};

export const updateReport = () => (dispatch) => AVAILABLE_STATISTICS.map((name) => dispatch(fetchStatistics(name)));
