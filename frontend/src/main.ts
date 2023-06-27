import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import I18n from 'vue-i18n';

import '@/assets/styles/custom.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle, faMinusCircle, faCog, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import workerFactory from '@/registerServiceWorker';
import routerFactory from '@/router';
import Language from '@/utils/Language';
import App from '@/App.vue';
import storeFactory from '@/store/store';
import apiFactory from './sipam';
import CONFIG from './config';

workerFactory(CONFIG);
// Icons
library.add(faPlusCircle, faMinusCircle, faCog, faEye, faEyeSlash);
Vue.component('fai', FontAwesomeIcon);

// Bootstap
Vue.use(BootstrapVue);
Vue.use(I18n);
Vue.config.productionTip = import.meta.env.DEV;

const i18n = new I18n();
Language.init(i18n);

const api = apiFactory(CONFIG);
const store = storeFactory(CONFIG, api);
const router = routerFactory(CONFIG, store);

Vue.mixin({
  data() {
    return {
      // Distribute runtime configs into every Vue component
      CONFIG,
    };
  },
});

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
