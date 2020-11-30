import axios from 'axios';
import config from '@/config';
import store from '@/store/store';
import router from '@/router';

// Axios Connection Config
// TODO: Move to webpack envs
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.timeout = 15000;
axios.defaults.headers.accept = 'application/json';


axios.interceptors.response.use(
  response => response,
  (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    if (status === 401 && originalRequest.url === `${axios.defaults.baseURL}/jwt/refresh/` && !config.oidc) {
      store.dispatch('Auth/DELETE_TOKEN');
      router.push('/login');
      return Promise.reject(error);
    }
    if (status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      if (!config.oidc) {
        return store.dispatch('Auth/REFRESH', {
          token: store.getters['Auth/token'],
          callback: () => {
            // eslint-disable-next-line no-param-reassign
            axios.defaults.headers.common.Authorization = `Token ${store.getters['Auth/token'].access}`;
            return axios.request(originalRequest);
          },
        });
      }
      if (store.getters['AuthOIDC/oidcIdToken']) {
        axios.defaults.headers.common.Authorization = `OPENID ${store.getters['AuthOIDC/oidcIdToken']}`;
      }
      return axios.request(originalRequest);
    }

    return Promise.reject(error);
  },
);
