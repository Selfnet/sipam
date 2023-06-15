import { VuexOidcClientSettings } from 'vuex-oidc';

export interface SIPAMConfiguration {
  oidcSettings: VuexOidcClientSettings;
  apiURL: string;
  baseURL: string;
  oidc: boolean;
}


interface OIDCConfiguration {
  'auto_sign_in': string | boolean;
  'issuer_url': string;
  'client_id': string;
  'enabled': string | boolean;

}
export interface Configuration {
    API_URL: string;
    APP_URL: string;
    BASE_URL: string | undefined;
    OIDC: OIDCConfiguration;
}
