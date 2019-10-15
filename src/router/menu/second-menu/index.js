import secondMenu from '@/page/menu/second-menu'
import secondMenuInfo from '@/page/menu/second-menu/info'
export default [{
  path: 'secondMenu',
  name: 'secondMenu',
  component: secondMenu
}, {
  path: 'secondMenuInfo',
  name: 'secondMenuInfo',
  component: secondMenuInfo,
  meta: {
    title: '二级详情'
  }
}]
