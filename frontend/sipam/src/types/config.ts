import { VuexOidcClientSettings } from 'vuex-oidc';

export interface SIPAMConfiguration {
  oidcSettings: VuexOidcClientSettings;
  apiURL: string;
  baseURL: string;
  oidc: boolean;
}
