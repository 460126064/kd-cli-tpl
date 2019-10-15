import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import mutations from './mutations'
import * as actions from './actions'
import state from './state'
import processModule from './modules/process'
//开发环境日志输出
import createLogger from 'vuex/dist/logger'
const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)
const vuexInstance = new Vuex.Store({
  getters,
  state,
  mutations,
  strict: debug,
  actions,
  plugins: debug ? [createLogger()] : [],
  modules: {
    process: processModule
  }
})
export default vuexInstance
