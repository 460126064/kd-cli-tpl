import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './zh'
Vue.use(VueI18n)
Vue.locale = () => {}
export const i18n = new VueI18n({
  locale: 'zh',
  messages
})