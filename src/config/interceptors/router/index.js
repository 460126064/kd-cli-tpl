import iView from 'iview'
import store from '@/store'
import {indexRouter} from '@/config'
const catchList = {}
export const routerBeforeEach = function (to, from, resolve) {
  const token = localStorage.getItem('token')
  const crumbsList = store.state.crumbsList
  const routes = crumbsList.length ? crumbsList : JSON.parse(sessionStorage.crumbsList || '[]')
  const routeMap = localStorage.menuMap ? new Map(JSON.parse(localStorage.menuMap)) : new Map()
  let oldCache, newCache
  //未登录状态，重定向到登录
  if ((!token && to.name !== 'login')) {
    resolve('/')
    return
  } else if (token && to.name === 'login') {
    //未登录状态，重定向到首页
    resolve(indexRouter)
    return
  }
  //页面缓存,新旧缓存替换
  oldCache = from.meta && from.meta.keepAlive
  newCache = to.meta && to.meta.keepAlive
  if (from.meta.keepAlive !== to.meta.keepAlive && to.meta.keepAlive) {
    catchList[oldCache] && (catchList[oldCache].length = 0)
    catchList[newCache] ? catchList[newCache].push(to.name) : catchList[newCache] = [to.name]
  } else if (from.meta.keepAlive === to.meta.keepAlive && to.meta.keepAlive) {
    catchList[newCache].indexOf(to.name) === -1 && !to.meta.noCache && catchList[newCache].push(to.name)
  } else {
    //全部清空
    catchList[oldCache] && (catchList[oldCache].length = 0)
  }
  store.commit('CACHE_LIST', Object.assign([], catchList[newCache] || []))
  let index = routes.findIndex(item => item.id === to.name)
  //如果index为最后一个，视为缓存，暂不处理
  if (index === routes.length - 1) {
    store.commit('CRUMBS_LIST', routes)
  } else if (!routeMap.has(to.name) && routeMap.size) {
    if (index >= 0) {
      //删除
      store.commit('CRUMBS_LIST', {
        start: index + 1
      })
    } else {
      //新增
      store.commit('CRUMBS_LIST', routes.concat({
        id: to.name,
        title: to.meta.title,
        query: to.query
      }))
    }
  } else {
    store.commit('CRUMBS_LIST', routeMap.get(to.name))
  }
  sessionStorage.setItem('crumbsList', JSON.stringify(store.state.crumbsList))
  iView.LoadingBar.start()
  resolve()
}
export const routerAfterEach = function (to, from) {
  iView.LoadingBar.finish()
}
