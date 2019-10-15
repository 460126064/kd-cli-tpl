import {isIE9} from '@/utils'
class Polyfill {
  constructor () {
    this.requestAnimationFrame()
    this.classList()
    this.dataset()
  }
  requestAnimationFrame () {
    let lastTime = 0
    let prefix = ['webkit', 'moz', 'ms', 'o']
    for (let i = 0, length = prefix.length; i < length && !window.requestAnimationFrame; i++) {
      window.requestAnimationFrame = window[`${prefix[i]}RequestAnimationFrame`]
      window.cancelAnimationFrame = window[`${prefix[i]}CancelAnimationFrame`] || window[`${prefix[i]}CancelRequestAnimationFrame`]
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (fn) {
        let currentTime = Date.now()
        let remainTime = Math.max(0, 16.6 - (currentTime - lastTime))
        let id = setTimeout(fn, remainTime)
        lastTime = currentTime + remainTime
        return id
      }
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id)
      }
    }
  }
  classList () {
    if (!isIE9()) return
    Object.defineProperty(HTMLElement.prototype, 'classList', {
      get () {
        const curryingClass = (fn) => {
          let className = (this.className || '').split(/\s+/g)
          return (cur) => {
            let idx = className.indexOf(cur)
            let res = fn.call(this, className, idx, cur)
            this.className = className.join(' ')
            return res
          }
        }
        return {
          remove: curryingClass((className, idx) => {
            return className.splice(idx, 1)
          }),
          add: curryingClass((className, idx, name) => {
            return className.push(name)
          }),
          contains: curryingClass((className, idx, name) => {
            return className.indexOf(name) > -1
          })
        }
      }
    })
  }
  dataset () {
    if (!isIE9()) return
    Object.defineProperty(HTMLElement.prototype, 'dataset', {
      get () {
        let attributes = this.attributes
        let name = []
        let value = []
        let obj = {}
        for (let i = 0; i < attributes.length; i++) {
          if (attributes[i].nodeName.slice(0, 5) == 'data-') {
            name.push(attributes[i].nodeName.slice(5))
            value.push(attributes[i].nodeValue)
          }
        }
        for (let j = 0; j < name.length; j++) {
          obj[name[j]] = value[j]
        }
        return obj
      }
    })
  }
}
export default {
  install () {
    /* eslint-disable no-new */
    new Polyfill()
  }
}
