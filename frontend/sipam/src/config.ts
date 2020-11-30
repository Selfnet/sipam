import { VuexOidcClientSettings } from 'vuex-oidc';

export default {
  // Axios Connection Config
  // TODO: Move to webpack envs
  oidcSettings: {
    authority: process.env.VUE_APP_OIDC_ISSUER_URL,
    clientId: process.env.VUE_APP_OIDC_CLIENT_ID,
    redirectUri: `${process.env.VUE_APP_URL}/oidc-callback`,
    redirect_uri: `${process.env.VUE_APP_URL}/oidc-callback-error`,
    popupRedirectUri: `${process.env.VUE_APP_URL}/oidc-callback-popup`,
    responseType: 'id_token',
    scope: 'openid',
    automaticSilentRenew: true,
    automaticSilentSignin: false,
    silentRedirectUri: `${process.env.VUE_APP_URL}/oidc-renew.html`,
  } as VuexOidcClientSettings,
  baseURL: process.env.VUE_APP_API_URL,
  oidc: process.env.VUE_APP_OIDC === 'true',
};
