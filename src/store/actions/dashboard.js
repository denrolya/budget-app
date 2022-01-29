import { createActions } from 'reduxsauce';
import { EXPENSE_TYPE } from 'src/constants/transactions';
import camelCase from 'voca/camel_case';
import capitalize from 'voca/capitalize';

import axios from 'src/services/http';
import { notify } from 'src/store/actions/global';
import { MOMENT_DATE_FORMAT } from 'src/constants/datetime';
import { generateCategoriesStatisticsTree, generatePreviousPeriod } from 'src/services/common';
import TimeperiodIntervalStatistics from 'src/models/TimeperiodIntervalStatistics';
import { AVAILABLE_STATISTICS } from 'src/constants/dashboard';

export const { Types, Creators } = createActions(
  {
    ...AVAILABLE_STATISTICS.map(({ name }) => ({
      [`fetchStatistics${capitalize(camelCase(name))}Request`]: null,
      [`fetchStatistics${capitalize(camelCase(name))}Success`]: [`${name}`],
      [`fetchStatistics${capitalize(camelCase(name))}Failure`]: ['error'],
    })).reduce((acc, curr) => Object.assign(acc, curr), {}),
    setStatistics: ['name', 'newModel'],
  },
  { prefix: 'DASHBOARD_' },
);

export const setStatistics = (name, newModel) => (dispatch) => {
  dispatch(Creators.setStatistics(name, newModel));
  dispatch(fetchStatistics(name));
};

export const fetchStatistics = ({ name, path, additionalParams }) => async (dispatch, getState) => {
  if (customHandlers[name]) {
    dispatch(customHandlers[name](path, additionalParams));
    return;
  }

  dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Request`]());

  const state = getState().dashboard[name];
  let params = {
    'executedAt[after]': state.from.format(MOMENT_DATE_FORMAT),
    'executedAt[before]': state.to.format(MOMENT_DATE_FORMAT),
  };

  if (state instanceof TimeperiodIntervalStatistics) {
    params.interval = state.interval;
  }

  if (additionalParams) {
    params = {
      ...params,
      ...additionalParams,
    };
  }

  try {
    const { data } = await axios.get(path, { params });
    dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Success`](data?.['hydra:member']?.[0]));
  } catch (e) {
    notify('error', `[Error]: Fetch Statistics(${name})`);
    dispatch(Creators[`fetchStatistics${capitalize(camelCase(name))}Failure`](e));
  }
};

const customHandlers = {
  categoriesTimeline: (path) => async (dispatch, getState) => {
    const {
      from,
      to,
      interval,
      data: { categories },
    } = getState().dashboard.transactionCategoriesTimeline;
    dispatch(Creators.fetchStatisticsCategoriesTimelineRequest());

    try {
      const { data } = await axios.get(path, {
        params: {
          categories,
          interval,
          'executedAt[after]': from.format(MOMENT_DATE_FORMAT),
          'executedAt[before]': to.format(MOMENT_DATE_FORMAT),
        },
      });

      dispatch(Creators.fetchStatisticsCategoriesTimelineSuccess(data['hydra:member'][0]));
    } catch (e) {
      dispatch(Creators.fetchStatisticsCategoriesTimelineFailure(e));
    }
  },
  expenseCategoriesTree: (path) => (dispatch, getState) => {
    const { from, to } = getState().dashboard.expenseCategoriesTree;

    dispatch(Creators.fetchStatisticsExpenseCategoriesTreeRequest());

    const getSelectedPeriodDataRequest = axios.get(path, {
      params: {
        type: EXPENSE_TYPE,
        'executedAt[after]': from.format(MOMENT_DATE_FORMAT),
        'executedAt[before]': to.format(MOMENT_DATE_FORMAT),
      },
    });

    const previousPeriod = generatePreviousPeriod(from, to);

    const getPreviousPeriodDataRequest = axios.get(path, {
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

export const updateDashboard = () => (dispatch) => AVAILABLE_STATISTICS.forEach((el) => dispatch(fetchStatistics(el)));
