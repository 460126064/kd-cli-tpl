const state = {
  /*换肤*/
  skin: {},
  /*POST请求携带token*/
  token: false,
  datumValue: 4,
  datumObj: 2,
  /*菜单选中key*/
  menuActiveName: 'businessSystem',
  /*菜单自动展开key*/
  menuOpenName: ['1'],
  /*页码数*/
  pageSize: 10,
  /*大模态框状态（已废弃）*/
  modelDisabled: true,
  /*面包屑*/
  crumbsList: [],
  /*菜单列表*/
  menuList: [],
  /* 路由缓存列表*/
  cacheList: [],
  currentMenu: {},
  userInfo: {},
  /* 头部header样式 style为banner: 通栏显示 */
  headerNav: {
    style: 'banner'
  },
  // 表格表头统一居中方式
  tableHeadAlign: 'center',
  // 是否开启手工打分
  isManualScore: true,
  isCollapsed: false,
  //侧边栏宽度
  sliderWidth: 220,
  //内容区域，树的宽度
  treeWidth: 220,
  // 头部title的场景描述
  fromTitle: '',
  // 头部title的附属描述
  fromTitleDesc: '',
  //全局提示信息
  tips: {}
}
export default state
