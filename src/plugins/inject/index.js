import $axios from 'plugins/axios'
import $api from 'plugins/api'
import $aide from 'components/system-aide'
import FooterOperator from '@/components/footer-operator'
import OperationLayout from '@/components/operation-layout'
import TipModal from '@/page/business/delete-modal'
import FormLayout from '@/components/layout/form-layout'
const components = {
  FormLayout,
  FooterOperator,
  OperationLayout,
  TipModal
}
export default {
  install: (Vue, options) => {
    Object.assign(Vue.prototype, {
      $ajax: $axios,
      $api,
      $aide
    })
    let hide = Vue.prototype.$Spin.hide
    Vue.prototype.$setRefs = function (name, key, value) {
      /* eslint-disable no-new */
      if (!name || !key) {
        throw new Error(`name and key must be required, error from $setRefs`)
      }
      let ref = this.$refs[name]
      if (!ref) {
        console.error(`${name} not found in $refs`)
        return this
      }
      ref.$set(key, value || '')
    }
    Vue.prototype.$methods = function (name, key, ...args) {
      /* eslint-disable no-new */
      if (!name || !key) {
        throw new Error(`name and key must be required, error from $methods`)
      }
      let ref = this.$refs[name]
      if (!ref) {
        console.error(`${name} not found in $methods`)
        return this
      }
      ref[key] && ref[key](...args)
    }
    Vue.prototype.$Spin.hide = function () {
      let ishidden = document.body.style.overflow === 'hidden'
      hide.apply(this, arguments)
      Vue.nextTick(() => {
        ishidden && (document.body.style.overflow = 'initial')
      })
    }
    Object.keys(components).forEach(key => {
      Vue.component(key, components[key])
    })
  }
}
