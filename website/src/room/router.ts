import Vue from 'vue'
import Router, { Route, RawLocation } from 'vue-router'

import Layout from '@/components/partial/Layout.vue';
import Home from '@/components/Home.vue';
import LandingContact from '@/components/landing/Contact.vue';
import OAuthCallback from '@/components/account/OAuthCallback.vue';
import Room from '@/components/room/Room.vue';

let loginAuth = async (to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
  if (window.localStorage.getItem("redirect") === to.path) {
    window.localStorage.setItem("redirect", "")
  }
  next()
}

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      name: '',
      path: '',
      component: Layout,
      children: [
        { path: '/',        name: 'home',    component: Home },
        { path: '/contact', name: 'contact', component: LandingContact },
      ]
    },
    { path: '/oauth/:provider/callback', name: 'oauth_callback', component: OAuthCallback },
    { path: '/room/:id',                 name: 'room',           component: Room },
    { path: '*',                         name: 'redirect',       redirect: '/' }
  ]
})

router.beforeEach(loginAuth)

export default router
