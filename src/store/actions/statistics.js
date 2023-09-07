import { createActions } from 'reduxsauce';

import axios from 'src/utils/http';
import { notify } from 'src/store/actions/global';

export const { Types, Creators } = createActions(
  {
    fetchRequest: ['name'],
    fetchSuccess: ['name'],
    fetchFailure: ['name', 'error'],
  },
  { prefix: 'STATISTICS_' },
);

export const fetchStatistics = ({
  name, path, params,
}) => async (dispatch) => {
  let result;
  dispatch(Creators.fetchRequest(name));

  try {
    const { data } = await axios.get(path, { params });
    result = data?.['hydra:member']?.[0] || data;
  } catch (e) {
    notify('error', `[Error]: Fetch Statistics(${name})`);
    dispatch(Creators.fetchFailure(name, e));
    return null;
  }

  dispatch(Creators.fetchSuccess(name));
  return result;
};
