import { VuexOidcClientSettings } from 'vuex-oidc';

export interface SIPAMConfiguration {
  oidcSettings: VuexOidcClientSettings;
  apiURL: string;
  baseURL: string;
  oidc: boolean;
}

const CONFIG: SIPAMConfiguration = {
  oidcSettings: {
    authority: import.meta.env.VITE_OIDC_ENDPOINT,
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
    redirectUri: `${import.meta.env.VITE_APP_URL}/oidc-callback`,
    redirect_uri: `${import.meta.env.VITE_APP_URL}/oidc-callback-error`,
    popupRedirectUri: `${import.meta.env.VITE_APP_URL}/oidc-callback-popup`,
    responseType: 'code',
    scope: 'openid profile email',
    includeIdTokenInSilentRenew: true,
    automaticSilentRenew: true,
    automaticSilentSignin: import.meta.env.VITE_OIDC_AUTO_SIGNIN === 'true',
    dispatchEventsOnWindow: true,
    silentRedirectUri: `${import.meta.env.VITE_APP_URL}/oidc-renew.html`,
  } as VuexOidcClientSettings,
  apiURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  baseURL: import.meta.env.BASE_URL || '/',
  oidc: !!import.meta.env.VITE_OIDC_ENDPOINT,
};

export default CONFIG;
