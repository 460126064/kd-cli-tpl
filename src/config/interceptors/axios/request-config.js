import $api from 'plugins/api'
import {timeFormat, isIE9} from '@/utils'
const {dutyChain} = $api
const isIE = isIE9(11) || isIE9(10) || isIE9(9)
/*
 *@description {Function} 序列化表单数据
 *@params {any} data序列化数据
 *@params {String} origin序序列化层级key
 *@params {Boolean} isArray 是否为数组下标
 *@return {String} 序列化成功后字符串
 *@example
 * serializeParam({
 *  list: [{
 *    title: 'title'
 *  }]
 * })
 * 结果为 list[0].title=title
 */
function serializeParam (data, origin = '', isArray) {
  let keys, isDate
  //过滤null
  data = (data === undefined || data === null) ? '' : data
  //过滤Date对象
  isDate = Object.prototype.toString.call(data) === '[object Date]'
  if (typeof data !== 'object' || isDate) {
    if (!origin) return new Error('data must be an Object or Array')
    //Date实例需要转换
    isDate && (data = timeFormat(data, serializeParam.format))
    return `${origin}=${data}&`
  }
  keys = Object.keys(data)
  keys.forEach((key, index) => {
    let obj = data[key]
    let _origin = /\.$/.test(origin) || !origin ? `${origin}` : `${origin}.`
    if (Array.isArray(obj)) {
      //判断是否为基础数据类型,暂不考虑数组内部数据类型不一致,如果为null，我们统一处理
      if (typeof obj[0] !== 'object' || obj[0] === null) {
        return (serializeParam.params += origin ? `${_origin}${key}=${obj.toString()}&` : `${key}=${obj.toString()}&`)
      }
      serializeParam(obj, `${_origin}${key}`, true)
    } else if (Object.prototype.toString.call(obj) === '[object Object]') {
      key = origin ? isArray ? `${origin}[${index}]` : `${_origin}${key}` : `${key}.`
      serializeParam(obj, key)
    } else {
      key = origin ? isArray ? `${origin}[${index}]` : `${_origin}${key}` : key
      serializeParam.params += serializeParam(obj, key)
    }
  })
  return serializeParam.params.slice(0, serializeParam.params.length - 1)
}
//get请求映射
const getMapping = function (type = '', config = {}) {
  if (['get', 'delete'].indexOf(type.toLowerCase()) === -1) return 'next'
  config.params = config.data || {}
  config.data = null
  for (let key in config.params) {
    let item = config.params[key]
    //日期类型
    let isDate = Object.prototype.toString.call(item) === '[object Date]'
    if (isDate) {
      config.params[key] = timeFormat(item, config.format || 'yyyy-MM-dd')
    }
    //判断数据类型
    if (Array.isArray(item)) {
      config.params[key] = item.toString()
    }
  }
  isIE && (config.params._t = Math.random())
}
//const请求映射
const postMapping = function (type = '', config = {}) {
  if (['post', 'put'].indexOf(type.toLowerCase()) === -1) return 'next'
  config.withCredentials = true
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) return
  Object.assign({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-XSRF-TOKEN': localStorage.getItem('token')
  }, config.headers)
  //加上返回token
  config.data._csrf = localStorage.getItem('token')
  serializeParam.params = ''
  serializeParam.format = config.format || 'yyyy-MM-dd'
  if (config.disabledData) return config
  serializeParam(config.data)
  config.data = encodeURI(serializeParam.params)
}
//注册职责链
const getDuty = dutyChain(getMapping)
const postDuty = dutyChain(postMapping)
//自定义职责链
getDuty.setNext(postDuty)
export {getDuty}
