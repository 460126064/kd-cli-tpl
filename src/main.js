import 'babel-polyfill'
import '@/static/lib/css/iview/iview.css'
import '@/static/lib/css/iconfont/iconfont.css'
import '@/static/lib/css/normallize/normallize.css'
import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
import {i18n} from 'plugins/i18n'
import inject from 'plugins/inject'
import decorate from 'plugins/decorate'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import iView from 'iview'
import {sentry} from './config'
import polyfill from 'plugins/polyfill'
import basetips from '@/mixins/base-tips'

const performance = process.env.NODE_ENV !== 'production'
// 全局实例化注入
Vue.use(iView)
Vue.use(inject)
Vue.use(decorate)
Vue.use(polyfill)
Vue.mixin(basetips)
//注入
//全局错误监听
Vue.config.errorHandler = (msg) => {
  msg && console.error(msg)
  Raven
    .config(sentry)
    .addPlugin(RavenVue, Vue)
    .install()
}
Vue.config.productionTip = false
Vue.config.performance = performance
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
