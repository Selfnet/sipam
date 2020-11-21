import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import VuexPersist from 'vuex-persist';

import CIDR from './modules/CIDR';
import Search from './modules/Search';
import Pool from './modules/Pool';
import Auth from './modules/Auth';
import { RootState } from '../types/store';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  reducer: (state: any) => ({
    Auth: state.Auth,
  }),
});

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0', // a simple property
  },
  modules: {
    CIDR,
    Pool,
    Search,
    Auth,
  },
  plugins: [vuexLocalStorage.plugin],
  strict: debug,
};

export default new Vuex.Store<RootState>(store);
