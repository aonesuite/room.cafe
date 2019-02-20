import Vue from 'vue'
import Router, { Route, RawLocation } from 'vue-router'

import Home from '@/components/Home.vue';
import Room from '@/components/room/Room.vue';

let loginAuth = async (to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
  next()
}

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    },
    {
      name: 'room',
      path: '/room/:id',
      component: Room
    },
    { path: '*', name: 'redirect', redirect: '/' }
  ]
})

router.beforeEach(loginAuth)

export default router
