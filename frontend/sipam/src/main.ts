import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import I18n from 'vue-i18n';
import '@/assets/styles/custom.scss';

import '@/registerServiceWorker';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle, faMinusCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import routerFactory from '@/router';
import Language from '@/utils/Language';
import App from '@/App.vue';
import fetchConfig from '@/config';
import storeFactory from '@/store/store';
import apiFactory from './sipam';

fetchConfig().then((config) => {
  // Icons
  library.add(faPlusCircle, faMinusCircle, faCog);
  Vue.component('fai', FontAwesomeIcon);

  // Bootstap
  Vue.use(BootstrapVue);
  Vue.use(I18n);
  Vue.config.productionTip = (process.env.NODE_ENV === 'development');

  const i18n = new I18n();
  Language.init(i18n);

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
    render: h => h(App),
  }).$mount('#app');
});
