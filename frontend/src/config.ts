import { VuexOidcClientSettings } from 'vuex-oidc';

export interface SIPAMConfiguration {
  oidcSettings: VuexOidcClientSettings;
  apiURL: string;
  baseURL: string;
  oidc: boolean;
}

const CONFIG: SIPAMConfiguration = {
  oidcSettings: {
    authority: process.env.OIDC_ENDPOINT,
    clientId: process.env.OIDC_CLIENT_ID,
    redirectUri: `${process.env.APP_URL}/oidc-callback`,
    redirect_uri: `${process.env.APP_URL}/oidc-callback-error`,
    popupRedirectUri: `${process.env.APP_URL}/oidc-callback-popup`,
    responseType: 'code',
    scope: 'openid profile email',
    includeIdTokenInSilentRenew: true,
    automaticSilentRenew: true,
    automaticSilentSignin: process.env.OIDC_AUTO_SIGNIN === 'true',
    dispatchEventsOnWindow: true,
    silentRedirectUri: `${process.env.APP_URL}/oidc-renew.html`,
  } as VuexOidcClientSettings,
  apiURL: process.env.API_URL || 'http://localhost:8000/api/v1',
  baseURL: process.env.BASE_URL || '/',
  oidc: !!process.env.OIDC_ENDPOINT,
};

export default CONFIG;
