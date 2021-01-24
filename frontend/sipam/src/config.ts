import { VuexOidcClientSettings } from 'vuex-oidc';
import { SIPAMConfiguration } from './types/config';


export default async () => {
  const runtimeConfig = await fetch('/config.json');
  const config = await runtimeConfig.json();

  // Axios Connection Config
  // TODO: Move to webpack envs
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
      automaticSilentSignin: false,
      dispatchEventsOnWindow: true,
      silentRedirectUri: `${config.APP_URL}/oidc-renew.html`,
    } as VuexOidcClientSettings,
    baseURL: config.API_URL,
    appURL: config.APP_URL,
    oidc: config.OIDC.enabled,
  } as SIPAMConfiguration;
};
