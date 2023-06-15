import { VuexOidcClientSettings } from 'vuex-oidc';
import { SIPAMConfiguration, Configuration } from './types/config';


export default async () => {
  const runtimeConfig = await fetch('/config.json');
  const config = await runtimeConfig.json() as Configuration;

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
      automaticSilentSignin: config.OIDC.auto_sign_in as boolean,
      dispatchEventsOnWindow: true,
      silentRedirectUri: `${config.APP_URL}/oidc-renew.html`,
    } as VuexOidcClientSettings,
    apiURL: config.API_URL,
    baseURL: config.BASE_URL || process.env.BASE_URL,
    oidc: config.OIDC.enabled,
  } as SIPAMConfiguration;
};
