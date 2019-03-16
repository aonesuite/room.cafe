import '@/assets/main.scss';

import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import { Select, Option, OptionGroup, Tabs, TabPane, Message, Upload } from 'element-ui';
import axios from 'axios';
import { detect } from 'detect-browser';
import lodash from 'lodash'

import App from './App.vue';
import store from '@/store';
import router from './router';

import { i18n } from '@/locales';

import Icon from "@/components/icons/Icon.vue";

Vue.use(Vuex);
Vue.use(BootstrapVue);

Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(OptionGroup.name, OptionGroup);
Vue.component(Message.name, Message);
Vue.component(Upload.name, Upload)

Vue.use(Tabs);
Vue.use(TabPane);

Vue.component(Icon.name, Icon);

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

axios.interceptors.request.use((config) =>{
  const token = localStorage.getItem("token");
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

Vue.prototype.$http = axios;
Vue.prototype.$browser = detect();
Vue.prototype.$lodash = lodash
Vue.prototype.$message = Message;

i18n.locale = localStorage.getItem("locale") || "en-US";

new Vue({
  i18n,
  store,
  router,
  render: h => h(App),
}).$mount('#app');
