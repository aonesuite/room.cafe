import '@/assets/main.scss'

import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';


import App from './App.vue';
import store from '@/store';
import router from './router';

import Icon from "@/components/icons/Icon.vue";

Vue.component(Icon.name, Icon);

Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
