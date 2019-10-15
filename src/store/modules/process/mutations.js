import * as types from './mutation-types'
const mutations = {
  [types.ROLE_LIST]: (state, payload) => { state.roleList = payload }
}
export default mutations
