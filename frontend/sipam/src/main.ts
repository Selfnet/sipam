import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import I18n from 'vue-i18n';
import '@/assets/styles/custom.scss';

import '@/registerServiceWorker';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle, faMinusCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import router from '@/router';
import Language from '@/components/Language';
import store from '@/store/store';
import App from '@/App.vue';

// Icons
library.add(faPlusCircle, faMinusCircle, faCog);
Vue.component('fai', FontAwesomeIcon);

// Bootstap
Vue.use(BootstrapVue);
Vue.use(I18n);
Vue.config.productionTip = false;

const i18n = new I18n();
Language.init(i18n);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
