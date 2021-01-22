import { VuexOidcClientSettings } from 'vuex-oidc';

export interface SIPAMConfiguration {
  oidcSettings: VuexOidcClientSettings;
  baseURL: string;
  oidc: boolean;
}
