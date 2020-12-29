import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from "../views/Recommend"

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: "Recommend",
  component: Recommend,
  meta: {
    isShowNav: true
  }
}, {
  path: '/hot',
  name: "Hot",
  component: () => import('../views/Hot'),
  meta: {
    isShowNav: true
  }
}, {
  path: '/search',
  name: "Search",
  component: () => import('../views/Search'),
  meta: {
    isShowNav: true
  }
}, {
  path: '/playlist',
  component: () => import('../views/PlayList')
}]

const router = new VueRouter({
  routes
})

export default router