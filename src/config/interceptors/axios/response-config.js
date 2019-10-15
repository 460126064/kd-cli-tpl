import $api from 'plugins/api'
import iView from 'iview'
import router from '@/router'
const {dutyChain, cookies} = $api
const status200 = function (type, res = {}) {
  if (type !== 200) return 'next'
  const {config} = res
  const method = config.method.toUpperCase()
  //考虑到浏览器刷新，必须存储到localStorage
  if (method === 'GET') {
    //获取cookie,进行设置
    localStorage.setItem('token', cookies.get('XSRF-TOKEN'))
  }
  //分支判断是否为临时环境的登录失败
  if (typeof res.data === 'string') {
    localStorage.clear()
    router.push('/')
    /* eslint-disable*/
    iView.Message.error('登录超时，请重新登录')
    return Promise.reject()
  }
  if (res.data && res.data.code && res.data.code != '2000') {
    switch (res.data.code) {
      case '10003':
        //重复提交
        res.data.message = '请勿重复提交'
        break
      case '5000':
        //服务端异常
        break
    }
    //判断是操作失败还是请求失败
    if (res.data.term.code) {
      return res
    }
    //阻止错误信息提示
    !config.preventMessage && iView.Message.error(res.data.message)
    return Promise.reject(res.data.message)
  }
  return res
}
//创建职责链
const statusDuty = dutyChain(status200)
//定义职责链
export {statusDuty}
