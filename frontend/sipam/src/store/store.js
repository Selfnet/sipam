import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import CIDR from './modules/CIDR';
import Search from './modules/Search';
import Pool from './modules/Pool';
import Auth from './modules/Auth';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  reducer: state => ({
    Auth: state.Auth,
  }),
});

export default new Vuex.Store({
  modules: {
    CIDR,
    Pool,
    Search,
    Auth,
  },
  plugins: [vuexLocalStorage.plugin],
  strict: debug,
});
