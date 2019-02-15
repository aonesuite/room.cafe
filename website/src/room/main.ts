import '@/assets/main.scss';

import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import { Select, Option, OptionGroup, Tabs, TabPane, ColorPicker } from 'element-ui';
import axios from 'axios';
import { detect } from 'detect-browser';
import lodash from 'lodash'

import App from './App.vue';
import store from '@/store';
import router from './router';

import Icon from "@/components/icons/Icon.vue";

Vue.use(Vuex);
Vue.use(BootstrapVue);

Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(OptionGroup.name, OptionGroup);

Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(ColorPicker);

Vue.component(Icon.name, Icon);

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

axios.interceptors.request.use((config) =>{
  if (localStorage.token) {
    config.headers['Authorization'] = 'Bearer ' + localStorage.token;
  }
  return config;
});

Vue.prototype.$http = axios;
Vue.prototype.$browser = detect();
Vue.prototype.$lodash = lodash

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
