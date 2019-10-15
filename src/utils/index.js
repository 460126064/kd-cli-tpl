import store from '@/store'
import {routes} from '@/router'
import {prefixPath} from '@/config'
import Sortable from 'sortablejs'
/**
 * 时间戳转换
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @param {Number} tamp 时间戳
 * @param {String} fmt 格式
 */
export function timeFormat (tamp, fmt) {
  let d = new Date(tamp)
  fmt = fmt || 'yyyy-MM-dd'
  if (!d || !tamp) return ''
  let o = {
    'M+': d.getMonth() + 1, //月份
    'd+': d.getDate(), //日
    'h+': d.getHours() % 12 == 0 ? 12 : d.getHours() % 12, //小时
    'H+': d.getHours(), //小时
    'm+': d.getMinutes(), //分
    's+': d.getSeconds(), //秒
    'q+': Math.floor((d.getMonth() + 3) / 3), //季度
    'S': d.getMilliseconds() //毫秒
  }
  let week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[d.getDay() + ''])
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
/**
 * @description 根据当前路由获取面包屑
 * @params {Array} menus 菜单列表
 * @params {String} name 当前路由name
 * @return {Array} routes 当前路由列表
 */
export const getMenuByRouter = (menus, name) => {
  // debugger
  let routes = []
  //获取面包屑组件
  let crumbsList = sessionStorage.getItem('crumbsList')
  function DFS (menu, callback) {
    //防止不是数组
    menu = [...menu]
    let res = menu.find((item, index) => {
      if (item.children && item.children.length) {
        return DFS(item.children)
      }
      if (item.id === name) return item
    })
    res && routes.unshift(res)
    return res
  }
  DFS(menus)
  if (routes.length <= 1) {
    crumbsList = crumbsList && JSON.parse(crumbsList)
    routes = crumbsList || []
  } else sessionStorage.removeItem('crumbsList')
  store.commit('CRUMBS_LIST', routes)
  store.commit('CURRENT_MENU', routes[routes.length - 1])
  return routes
}

/**
 * @description 根据当前路由名称获取面包屑
 * @params {Array} menus 菜单列表
 * @params {String} name 当前路由name
 * @return {Array} routes 当前路由列表
 */
export const getMenuNameByRouter = () => {
  let menuNames = {}
  return (name) => {
    if (menuNames[name]) return menuNames[name]
    const menuList = routes.find(item => item.path === '/index').children
    const eachName = function (list) {
      list.some(item => {
        if (item.name === name) {
          return (menuNames[name] = item.meta.title)
        }
        if (item.children && item.children.length) {
          eachName(item.children)
        }
      })
    }
    eachName(menuList)
    return menuNames[name]
  }
}
/**
  *[imagePath {Function} 全局图片路径处理函数 ]
  * @param {string} type 图片类型，根据类型判断返回默认图片
  * @param {string} 图片Id 没有则为空，返回对应类型默认图片
  * @returns {string} 返回合并后图片路径
  */
export const imagePath = (type, imgId) => {
  if (!type) throw new Error('请输入图片类型')
  if (imgId) {
    return `${prefixPath}api-file/portal/file/stream/${imgId}?origin=true`
  }
  switch (type) {
    case 'course' :
      return import('@/static/images/course/cover-image-1.png')
    case 'headImg' :
      return import('@/static/images/user/header-3.png')
    case 'user' :
      return import('@/static/images/user/header-3.png')
    case 'album' :
      return '../../static/images/album-default.png'
    case 'zero' :
      return import('@/static/images/zero.png')
  }
}
/**
  *[getPropByPath {Function} 根据path遍历获取object值 ]
  * @param {Object} obj 图片类型，根据类型判断返回默认图片
  * @param {String} path 循环的字符串，例如 'a.b.c'
  * @returns {Function} 返回获取后的值
  */
export const getPropByPath = (context, obj = {}) => {
  return (path = []) => {
    let model = context[obj]
    path = path.split('.')
    for (let key of path) {
      model = model[key] || ''
    }
    return model
  }
}
/**
  *[levelLinkage {Function} 联动关系处理方法 ]
  * @param {Array} arr 存放ref、isLink的数组
  * @param ref 组件的ref属性
  * @param isLink 是否需要上级的value作为本请求的参数, true不需要   false需要或不传
  * 需配合 data-dictionary组件使用
*/
export const levelLinkage = function (arrs, obj) {
  arrs.forEach((item, index) => {
    let ref = this.$refs[item.ref]
    if (ref.alreadySelect) {
      let a = ref.alreadySelect
      if (arrs[index + 1]) {
        if (obj) {
          this.$refs[arrs[index + 1].ref].getDictionary(a, obj)
        } else {
          this.$refs[arrs[index + 1].ref].getDictionary(a)
        }
      } else {
        return false
      }
    }
    ref.$on('on-change', function (val) {
      onChange({
        val,
        index
      })
    })
  })
  const onChange = ({val, index}) => {
    let refNext
    let isLink
    if (arrs[index + 1]) {
      refNext = this.$refs[arrs[index + 1].ref]
      isLink = arrs[index + 1].isLink
      refNext.clearOption()
    } else {
      isLink = arrs[index].isLink
      refNext = this.$refs[arrs[index].ref]
    }
    if (val) {
      if (!isLink) {
        refNext.getDictionary(val, obj)
      } else {
        refNext.getDictionary()
      }
    }
  }
}
/**
 * @constructor {Function} 创建拖拽排序
 * @param {Object} DOM对象
 * @param {Object} 配置对象
 */
export const createSortable = function (el, options) {
  return Sortable.create(el, options)
}
export function trigger (el, type) {
  //初始化HTML事件，如果需要自定义事件，请参考customEvent
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
//query转换字符串
export const stringifyQuery = function (obj) {
  function encode (str) {
    return encodeURI(str)
  }
  let res = obj ? Object.keys(obj).map(function (key) {
    let val = obj[key]
    if (val === undefined) {
      return ''
    }
    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0 }).join('&') : null
  return res ? ('?' + res) : ''
}
//拦截器工厂函数
export const interceptorFactory = function (options = {}) {
  //拦截器抽象类
  class InterceptorAbstract {
    handlers = null
    use (cbSet) {
      this.handlers.push(cbSet)
    }
  }
  class Request extends InterceptorAbstract {
    handlers = []
    constructor () {
      super()
      this.use(options.request)
    }
  }
  class Response extends InterceptorAbstract {
    handlers = []
    constructor () {
      super()
      this.use(options.response)
    }
  }
  class Factory {
    chain = []
    request = new Request()
    response = new Response()
    promise = Promise.resolve()
    constructor () {
      this.chain.push(...this.request.handlers, options.dispatch, ...this.response.handlers)
    }
    exec () {
      this.chain.forEach(currentChain => {
        this.promise = this.promise.then(currentChain.resolve, currentChain.reject)
      })
      return this.promise
    }
  }
  return new Factory()
}
//向上查找父组件
export const findComponentUpward = function (context, componentName) {
  let parent = context.$parent
  let name = parent.$options.name
  let componentNameList = Array.isArray(componentName) ? componentName : [componentName]
  while (parent) {
    if (componentNameList.indexOf(name) > -1) break
    parent = parent.$parent
    name = (parent && parent.$options.name) || name
  }
  return parent
}
//向下查找子组件
export function findComponentDownward (context, componentName) {
  const childrens = context.$children
  let children = null
  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name
      if (name === componentName) {
        children = child
        break
      } else {
        children = findComponentDownward(child, componentName)
        if (children) break
      }
    }
  }
  return children
}
export function isNaN (val) {
  // eslint-disable-next-line
  return val !== val
}

// IE9的判断
export function isIE9 (version = 9) {
  let UA = window.navigator.userAgent.toLowerCase()
  // ie9 兼容性视图
  const compatibility = 7
  let IEFlag = /trident/
  let IE9Flag = /msie\s*(\d+)|rv:(\d+)/
  if (!IEFlag.test(UA)) return false
  let result = (UA || '').match(IE9Flag)
  result = ~~(result[1] || result[2])
  return result === version || result === compatibility
}
