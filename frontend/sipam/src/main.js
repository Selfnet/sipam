import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import I18n from 'vue-i18n';
import './assets/styles/custom.scss';

import './registerServiceWorker';
import BootstrapVueTreeview from 'bootstrap-vue-treeview';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle, faMinusCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import Language from './components/Language';
import store from './store/store';
import router from './router';
import App from './App.vue';


// Icons
library.add(faPlusCircle, faMinusCircle, faCog);
Vue.component('fai', FontAwesomeIcon);

// Bootstap
Vue.use(BootstrapVue);
Vue.use(I18n);
Vue.use(BootstrapVueTreeview);

Vue.config.productionTip = false;

// Axios Connection Config
// TODO: Move to webpack envs
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.timeout = 1000;
axios.defaults.headers.accept = 'application/json';
const i18n = new I18n();
Language.init(i18n);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
