import { VuexOidcClientSettings } from 'vuex-oidc';

export interface SIPAMConfiguration {
  oidcSettings: VuexOidcClientSettings;
  apiURL: string;
  baseURL: string;
  oidc: boolean;
}

interface OIDCOptions {
  enabled: boolean;
  client_id: string;
  issuer_url: string;
}

interface WebConfiguration {
  API_URL: string;
  APP_URL: string;
  BASE_URL?: string;
  DEBUG: boolean;
  OIDC: OIDCOptions;
}

const DEV_CONFIG: SIPAMConfiguration = {
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

async function fetchRemoteConfig() {
  const runtimeConfig = await fetch('/config.json');
  const config = (await runtimeConfig.json()) as WebConfiguration;

  // Axios Connection Config
  return {
    oidcSettings: {
      authority: config.OIDC.issuer_url,
      clientId: config.OIDC.client_id,
      redirectUri: `${config.APP_URL}/oidc-callback`,
      redirect_uri: `${config.APP_URL}/oidc-callback-error`,
      popupRedirectUri: `${config.APP_URL}/oidc-callback-popup`,
      responseType: 'code',
      scope: 'openid profile email',
      includeIdTokenInSilentRenew: true,
      automaticSilentRenew: true,
      automaticSilentSignin: true,
      dispatchEventsOnWindow: true,
      silentRedirectUri: `${config.APP_URL}/oidc-renew.html`,
    } as VuexOidcClientSettings,
    apiURL: config.API_URL,
    baseURL: config.BASE_URL || '/',
    oidc: config.OIDC.enabled,
  } as SIPAMConfiguration;
}

export default async () => {
  if (import.meta.env.DEV) {
    return DEV_CONFIG;
  }
  return fetchRemoteConfig();
};
