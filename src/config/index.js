//全局请求路径
export const AXIOS_DEFAULT_CONFIG = {
  baseURL: '/',
  timeout: 20000
}
//sentry配置id
export const sentry = 'https://b737ed169d6843ec8eea412852203e09@sentry.io/1226863'
//代理前缀
export const prefixPath = process.env.NODE_ENV !== 'production' ? 'api/' : '/'
//全局主色调
export const mainColor = '#1890FF'
//登录成功跳转路由地址
export const indexRouter = 'secondMenu'
export const power = false
