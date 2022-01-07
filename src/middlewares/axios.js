import Swal from 'sweetalert2';
import { Service } from 'axios-middleware';

import axios from 'src/services/http';
import { FORBIDDEN, UNAUTHORIZED } from 'src/constants/http';
import { logoutUser } from 'src/store/actions/auth';
import { notify } from 'src/store/actions/global';
import store from 'src/store/store';

const service = new Service(axios);

service.register({
  onRequest(config) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
  },
  onResponseError(error) {
    const { status } = error.response;

    if (status === FORBIDDEN || status === UNAUTHORIZED) {
      const message = status === UNAUTHORIZED ? 'Session terminated!' : 'Not enough access rights!';
      notify('warning', message, 'Authorization error');
      store.dispatch(logoutUser());
    } else if (status >= 400 && status < 500) {
      notify('warning', 'Bad request was sent!');
    } else if (status >= 500 && status < 600) {
      notify('error', 'Error happened on backend!');
    }

    const profilerLink = error.response.headers['x-debug-token-link'];
    if (profilerLink) {
      Swal.fire(
        `Error ${status}!`,
        `Error happened on backend. Here is a <a href="${profilerLink}" target="_blank" rel="noopener nofollow">PROFILER</a>`,
        'warning',
      );
    }

    return Promise.reject(error);
  },
});
