import store from '@/store/store';
import config from '@/config';
import { Api, RequestParams } from './types/api';

function getToken(accessToken?: string | null | undefined): string {
  if (config.oidc) {
    return `OPENID  ${accessToken || store.getters['AuthOIDC/oidcIdToken'] || ''}`;
  }
  return `Bearer ${accessToken || store.getters['Auth/token'].access || ''}`;
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

export default {
  api: new Api(
    {
      baseUrl: process.env.VUE_APP_API_URL,
      securityWorker: getRequestHeaders,
    },
  ),
};
