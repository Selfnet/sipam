import config from '@/config';
import { RequestParams, Api } from './types/api';

function getToken(accessToken?: string | null | undefined): string {
  if (config.oidc) {
    // eslint-disable-next-line global-require
    const store = require('@/store/store').useStore();
    // console.log(accessToken);
    // console.log(store.getters['AuthOIDC/oidcAccessToken']);
    return `OPENID  ${accessToken || store.getters['AuthOIDC/oidcAccessToken'] || ''}`;
  }
  return `Bearer ${accessToken || ''}`;
}

const getRequestHeaders = (accessToken: string | null | undefined): RequestParams => ({
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `${getToken(accessToken)}`,
  },
  redirect: 'follow',
  referrerPolicy: 'no-referrer',
});
const api = new Api(
  {
    baseUrl: process.env.VUE_APP_API_URL,
    securityWorker: getRequestHeaders,
  },
);

export default {
  api,
};
