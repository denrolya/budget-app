import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
instance.all = axios.all;
instance.spread = axios.spread;

export default instance;
