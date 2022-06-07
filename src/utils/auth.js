import moment from 'moment-timezone';

export const parseJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
};

export const getUser = () => JSON.parse(localStorage.getItem('user'));

export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const isTokenPresent = () => !!getToken();

export const isTokenValid = () => {
  const { exp } = parseJWT(getToken());

  return moment().isBefore(moment.unix(exp));
};

export const isTokenPresentAndValid = () => isTokenPresent() && isTokenValid();
