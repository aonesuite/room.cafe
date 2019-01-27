import Vue from 'vue'
import Router, { Route, RawLocation } from 'vue-router'

import Home from '@/components/Home.vue';

let loginAuth = async (to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
  next()
}

let scrollBehavior = function(to: Route, from: Route, savedPosition: any) {
  if (savedPosition) {
    return savedPosition
  } else {
    const position = {
      selector: "",
      x: 0,
      y: 0,
    }
    if (to.hash) {
      position.selector = to.hash
    }
    if (to.matched.some(m => m.meta.scrollToTop)) {
      position.x = 0
      position.y = 0
    }
    return position
  }
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
    { path: '*', name: 'redirect', redirect: '/' }
  ],
  scrollBehavior: scrollBehavior
})

router.beforeEach(loginAuth)

router.afterEach((to, from) => {
  if (from.fullPath !== '/') {
    window.localStorage.setItem('previous-route', from.fullPath)
  }
})

export default router
