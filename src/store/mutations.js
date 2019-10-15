import * as types from './mutation-types'
const mutations = {
  [types.SKIN]: (state, payload) => { state.skin = payload },
  [types.TOKEN]: (state, payload) => { state.token = payload },
  [types.MENUOPENNAME]: (state, payload) => { state.menuOpenName = payload },
  [types.MENUACTIVENAME]: (state, payload) => { state.menuActiveName = payload },
  [types.PAGE_SIZE]: (state, payload) => { state.pageSize = payload },
  [types.MODEL_DISABLED]: (state, payload) => { state.modelDisabled = payload },
  [types.CACHE_LIST]: (state, payload) => { state.cacheList = payload },
  [types.CURRENT_MENU]: (state, payload) => { state.currentMenu = payload },
  [types.USER_INFO]: (state, payload) => { state.userInfo = payload },
  [types.CRUMBS_LIST]: (state, payload) => {
    if (Array.isArray(payload)) {
      state.crumbsList = payload
    } else if (Object.prototype.toString.call(payload) === '[object Object]') {
      state.crumbsList.splice(payload.start)
    }
  },
  [types.MENU_LIST]: (state, payload) => { state.menuList = payload },
  [types.IS_MANUAL_SCORE]: (state, payload) => { state.isManualScore = payload },
  [types.ISCOLLAPSED]: (state, payload) => { state.isCollapsed = payload },
  [types.SLIDERWIDTH]: (state, payload) => { state.sliderWidth = payload },
  [types.TREEWIDTH]: (state, payload) => { state.treeWidth = payload },
  [types.FROMTITLE]: (state, payload) => { state.fromTitle = payload },
  [types.FROMTITLEDESC]: (state, payload) => { state.fromTitleDesc = payload },
  [types.TIPS]: (state, payload) => { state.tips = payload }
}
export default mutations
