import { createActions } from 'reduxsauce';
import camelCase from 'voca/camel_case';
import capitalize from 'voca/capitalize';

import axios from 'src/utils/http';
import { notify } from 'src/store/actions/global';
import { AVAILABLE_STATISTICS } from 'src/constants/statistics';

export const { Types, Creators } = createActions(
  {
    ...AVAILABLE_STATISTICS.map((name) => ({
      [`fetch${capitalize(camelCase(name))}Request`]: null,
      [`fetch${capitalize(camelCase(name))}Success`]: null,
      [`fetch${capitalize(camelCase(name))}Failure`]: ['error'],
    })).reduce((acc, curr) => Object.assign(acc, curr), {}),
  },
  { prefix: 'STATISTICS_' },
);

export const fetchStatistics = ({
  name, path, params,
}) => async (dispatch) => {
  let result;
  dispatch(Creators[`fetch${capitalize(camelCase(name))}Request`]());

  try {
    const { data } = await axios.get(path, { params });
    result = data?.['hydra:member']?.[0] || data;
  } catch (e) {
    notify('error', `[Error]: Fetch Statistics(${name})`);
    dispatch(Creators[`fetch${capitalize(camelCase(name))}Failure`](e));
    return null;
  }

  dispatch(Creators[`fetch${capitalize(camelCase(name))}Success`]());
  return result;
};
