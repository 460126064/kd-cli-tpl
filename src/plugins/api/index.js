import colorComputed from './color-computed'
import DutyChainPattern from './chain-pattern'
import {redixDuty} from './color-unitconvert'
export default {
  //换肤颜色算法
  colorComputed: colorComputed,
  colorUnitConvert (color = '') {
    return redixDuty.exec(color)
  },
  //统一输出
  console (type) {
    let _console = window.console
    //IE8版本下下静默。eslint在生产环境已强制去除console和debugger语句
    if (!_console) return
    _console[type].apply(null, Array.from(arguments).slice(1))
  },
  //职责链模式
  dutyChain (callback = () => {}) {
    /* eslint-disable no-new */
    return new DutyChainPattern(callback)
  },
  cookies: {
    get (key) {
      let reg = new RegExp(`${key}=([^;]*)`)
      return document.cookie.match(reg) && document.cookie.match(reg)[1]
    },
    set (key, val, lifecycle) {
      let date = new Date()
      date.setTime(date.getTime() + (lifecycle * 24 * 60 * 60 * 1000))
      document.cookie = `${key}=${val};expires=${date.toUTCString()}`
    },
    remove (key) {
      this.set(key, '', -1)
    }
  }
}
