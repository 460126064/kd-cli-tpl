import systemAide from './system-aide'
import Vue from 'vue'
let systemAideInstance = getNewInstance()
/* eslint-disable no-new */
function getNewInstance (options = {}) {
  let instance = new Vue({
    render (h) {
      return h(systemAide, {
        props: options
      })
    }
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
  return instance.$children[0]
}
export default {
  init () {
    this.destroy()
    systemAideInstance = getNewInstance.apply(this, arguments)
    return this
  },
  show (isShow) {
    systemAideInstance.isShow = isShow
    return this
  },
  update (content) {
    systemAideInstance.content = content
    return this
  },
  destroy () {
    document.body.removeChild(systemAideInstance.$el)
  }
}
