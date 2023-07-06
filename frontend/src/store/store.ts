import Vuex, { StoreOptions } from 'vuex';
import { vuexOidcCreateStoreModule, VuexOidcStoreListeners } from 'vuex-oidc';
import { User } from 'oidc-client';
import Pool from '@/store/modules/Pool.ts';
import Auth from '@/store/modules/Auth.ts';
import CIDR from '@/store/modules/CIDR.ts';
import Search from '@/store/modules/Search.ts';
import Token from '@/store/modules/Token.ts';
import { RootState } from '@/types/store.ts';
import { SIPAMConfiguration } from '@/config.ts';
import { Api } from '@/types/api.ts';

export default function storeFactory(config: SIPAMConfiguration, SIPAM: Api) {
  const listeners: VuexOidcStoreListeners = {
    userLoaded: (user: User) => SIPAM.setSecurityData(user.access_token),
    userUnloaded: () => SIPAM.setSecurityData(null),
  };

  const AuthOIDC = vuexOidcCreateStoreModule(config.oidcSettings, { namespaced: true }, listeners);

  const storeOptions: StoreOptions<RootState> = {
    state: {
      version: '1.0.0', // a simple property
      config,
      api: SIPAM,
    },
    modules: {
      CIDR,
      Pool,
      Search,
      Auth,
      Token,
      AuthOIDC,
    },
    strict: import.meta.env.DEV,
  };
  return new Vuex.Store<RootState>(storeOptions);
}
