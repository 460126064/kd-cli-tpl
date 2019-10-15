import Vue from 'vue'
import Router from 'vue-router'
import {routerBeforeEach, routerAfterEach} from '@/config/interceptors/router'
import menu from './menu'
const login = () => import('@/page/login/login')
const index = () => import('@/page/index/index')
Vue.use(Router)
export const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  }, {
    path: '/index',
    name: 'index',
    component: index,
    children: [
      ...menu
    ]
  }
]
const routerInstance = new Router({
  routes: routes
})
routerInstance.beforeEach(routerBeforeEach)
routerInstance.afterEach(routerAfterEach)
export default routerInstance
