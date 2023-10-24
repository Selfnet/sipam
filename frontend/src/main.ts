import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import I18n from 'vue-i18n';

import '@/assets/styles/custom.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle, faMinusCircle, faCog, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import routerFactory from '@/router.ts';
import Language from '@/utils/Language.ts';
import App from '@/App.vue';
import storeFactory from '@/store/store.ts';
import apiFactory from '@/sipam.ts';
import CONFIG from '@/config.ts';
import Vuex from 'vuex';

const config = await CONFIG();

// Icons
library.add(faPlusCircle, faMinusCircle, faCog, faEye, faEyeSlash);
Vue.component('fai', FontAwesomeIcon);

// Bootstap
Vue.use(BootstrapVue);
Vue.use(I18n);
Vue.config.productionTip = import.meta.env.DEV;

const i18n = new I18n();
Language.init(i18n);

Vue.use(Vuex);
const api = apiFactory(config);
const store = storeFactory(config, api);
const router = routerFactory(config, store);

Vue.mixin({
  data() {
    return {
      // Distribute runtime configs into every Vue component
      config,
    };
  },
});

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
