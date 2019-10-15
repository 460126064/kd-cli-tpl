import {prefixPath, power} from '@/config'
import {getDuty} from './request-config'
import {statusDuty} from './response-config'
import router from '@/router'
// 请求成功回调
export const reqSucCallback = function (config) {
  //职责链开始
  config.baseURL += process.env.NODE_ENV === 'production' ? '' : prefixPath
  return getDuty.exec(config.method.toLowerCase(), config).then(() => {
    return config
  })
}
// 请求失败回调
export const reqFailCallback = function () {}
//响应成功回调
export const resSucCallback = function (res) {
  const data = statusDuty.exec(res.status, res)
  return data.then((res) => {
    if (typeof res === 'object') return Promise.resolve(res)
  })
}
// 响应失败回调
export const resFailCallback = function ({response}) {
  if (response.status === 401 && power) {
    localStorage.clear()
    router.push({path: '/'})
  }
  return Promise.reject(response)
}
