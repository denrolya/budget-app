import { createActions } from 'reduxsauce';
import { EXPENSE_TYPE } from 'src/constants/transactions';
import camelCase from 'voca/camel_case';
import kebabCase from 'voca/kebab_case';
import capitalize from 'voca/capitalize';

import axios from 'src/services/http';
import { notify } from 'src/store/actions/global';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { generateCategoriesStatisticsTree, generatePreviousPeriod } from 'src/services/common';
import TimeperiodStatistics from 'src/models/TimeperiodStatistics';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { AVAILABLE_STATISTICS } from 'src/constants/dashboard';

export const { Types, Creators } = createActions(
  {
    ...AVAILABLE_STATISTICS.map((name) => ({
      [`fetchStatistics${capitalize(camelCase(name))}Request`]: null,
      [`fetchStatistics${capitalize(camelCase(name))}Success`]: [`${name}`],
      [`fetchStatistics${capitalize(camelCase(name))}Failure`]: ['message'],
    })).reduce((acc, curr) => Object.assign(acc, curr), {}),
    setStatistics: ['name', 'newModel'],
  },
  { prefix: 'DASHBOARD_' },
);

export const setStatistics = (name, newModel) => (dispatch) => {
  dispatch(Creators.setStatistics(name, newModel));
  dispatch(fetchStatistics(name));
};

export const fetchStatistics = (name) => (dispatch, getState) => {
  if (customHandlers[name]) {
    return dispatch(customHandlers[name]());
  }

  dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Request`]());

  const state = getState().dashboard[name];
  const requestParams = {};

  if (state instanceof TimeperiodStatistics) {
    requestParams.from = state.from.format(MOMENT_DATE_FORMAT);
    requestParams.to = state.to.format(MOMENT_DATE_FORMAT);
  } else if (state instanceof TimeperiodIntervalStatistics) {
    requestParams.from = state.from.format(MOMENT_DATE_FORMAT);
    requestParams.to = state.to.format(MOMENT_DATE_FORMAT);
    requestParams.interval = state.interval;
  }

  return axios
    .get(`api/transactions/statistics/${kebabCase(name)}`, requestParams)
    .then(({ data }) => dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Success`](data?.['hydra:member']?.[0])))
    .catch((e) => {
      notify('error', `[Error]: Fetch Statistics(${name})`);
      dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Failure`](e.message));
    });
};

const customHandlers = {
  transactionCategoriesTimeline: () => async (dispatch, getState) => {
    const {
      from,
      to,
      interval,
      data: { categories },
    } = getState().dashboard.transactionCategoriesTimeline;
    dispatch(Creators.fetchStatisticsTransactionCategoriesTimelineRequest());

    try {
      const { data } = await axios.get('api/transactions/statistics/categories-timeline', {
        params: {
          categories,
          interval,
          from: from.format(MOMENT_DATE_FORMAT),
          to: to.format(MOMENT_DATE_FORMAT),
        },
      });

      dispatch(Creators.fetchStatisticsTransactionCategoriesTimelineSuccess(data['hydra:member'][0]));
    } catch (e) {
      dispatch(Creators.fetchStatisticsTransactionCategoriesTimelineFailure(e));
    }
  },
  expenseCategoriesTree: () => (dispatch, getState) => {
    const { from, to } = getState().dashboard.expenseCategoriesTree;

    dispatch(Creators.fetchStatisticsExpenseCategoriesTreeRequest());

    const getSelectedPeriodDataRequest = axios.get('api/transactions/statistics/categories-tree', {
      params: {
        type: EXPENSE_TYPE,
        from: from.format(MOMENT_DATE_FORMAT),
        to: to.format(MOMENT_DATE_FORMAT),
      },
    });

    const previousPeriod = generatePreviousPeriod(from, to);

    const getPreviousPeriodDataRequest = axios.get('api/transactions/statistics/categories-tree', {
      params: {
        ...previousPeriod,
        type: EXPENSE_TYPE,
      },
    });

    axios
      .all([getSelectedPeriodDataRequest, getPreviousPeriodDataRequest])
      .then(
        axios.spread((...responses) => {
          const currentPeriodData = responses[0].data?.['hydra:member'][0];
          const previousPeriodData = responses[1].data?.['hydra:member'][0];

          dispatch(
            Creators.fetchStatisticsExpenseCategoriesTreeSuccess(
              generateCategoriesStatisticsTree(currentPeriodData, previousPeriodData),
            ),
          );
        }),
      )
      .catch((e) => {
        dispatch(Creators.fetchStatisticsExpenseCategoriesTreeFailure(e.message));
      });
  },
};

export const updateDashboardInterval = (from, to) => (dispatch, getState) => {
  const { settings } = getState().auth.user;
  const dashboardStatistics = getState().dashboard;

  settings.dashboardStatistics.forEach((name) => {
    if (name !== 'moneyFlow') {
      dispatch(
        setStatistics(
          name,
          dashboardStatistics[name].merge({
            from,
            to,
          }),
        ),
      );
    }
  });
};

export const updateDashboard = () => (dispatch, getState) => {
  const { settings } = getState().auth.user;

  settings.dashboardStatistics.map((name) => dispatch(fetchStatistics(name)));
};
