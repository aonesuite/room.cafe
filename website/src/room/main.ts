import '@/assets/main.scss'

import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import axios, { AxiosTransformer } from 'axios';

import App from './App.vue';
import store from '@/store';
import router from './router';

import Icon from "@/components/icons/Icon.vue";

Vue.component(Icon.name, Icon);

Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL

const transformRequest: AxiosTransformer = () => {
  return [
    (data: any, headers: any) => {
      if (localStorage.token) {
        headers['Authorization'] = 'Bearer ' + localStorage.token
      }
    }
  ];
};

axios.defaults.transformRequest = transformRequest;

Vue.prototype.$http = axios

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
