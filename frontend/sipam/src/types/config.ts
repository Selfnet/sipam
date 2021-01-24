import { VuexOidcClientSettings } from 'vuex-oidc';

export interface SIPAMConfiguration {
  oidcSettings: VuexOidcClientSettings;
  baseURL: string;
  appURL: string;
  oidc: boolean;
}
