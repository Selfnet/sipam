import Vue from 'vue';
import Vuex from 'vuex';
import CIDR from './modules/CIDR';
import Search from './modules/Search';
import Pool from './modules/Pool';
import Auth from './modules/Auth';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    CIDR,
    Pool,
    Search,
    Auth,
  },
});
