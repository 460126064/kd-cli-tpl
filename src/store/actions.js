import axios from '@/plugins/axios'
import {Base64} from 'js-base64'
import md5 from 'js-md5'
export const loginValidate = function ({commit}, vm) {
  const pwd = md5(vm.formInline.password)
  return new Promise((resolve, reject) => {
    axios({
      url: `/userlogin/login`,
      headers: {
        'Authorization': `Basic ${Base64.encode(`${vm.formInline.loginName}:${pwd}`)}`
      },
      data: {
        loginName: vm.formInline.loginName,
        password: vm.formInline.password
      },
      method: 'POST'
    }).then(({data, headers}) => {
      if (data.code === 0) {
        resolve(data)
        return false
      }
      reject(data)
    }).catch((err) => reject(err))
  })
}

export const getUser = function ({commit}) {
  return new Promise((resolve, reject) => {
    resolve({
      user: 'lk',
      password: '888888'
    })
  })
}

export const generateRoutes = function ({commit}) {
  return new Promise((resolve, reject) => {
    resolve({
      user: 'lk',
      password: '888888'
    })
  })
}

/**
 * 获取数据字典方法
 */
export const getBaseData = function ({commit}, baseDataKeys) {
  let params = 'typeCodes=' + baseDataKeys.join('&typeCodes=')
  return new Promise((resolve, reject) => {
    axios({
      url: `api-basic/workbench/dicttype/findDictList?${params}`,
      method: 'GET'
    }).then(res => {
      if (res.data.code == 2000) {
        let baseDataTypeMap = {}
        res.data.data.forEach(typeEle => {
          let baseDataMap = {}
          typeEle.dicts.forEach(dataEle => {
            baseDataMap[dataEle.dictCode] = dataEle.dictName
          })
          baseDataTypeMap[typeEle.dictTypeCode] = baseDataMap
        })
        resolve(baseDataTypeMap)
      } else {
        reject(res)
      }
    }).catch((err) => reject(err))
  })
}

/**
 * 获取操作
 * @param params.modelCode 业务编码，全家唯一
 * @param params.primaryKey 主键
 * @param params.list 数据列表
 */
export const concatOpts = function ({commit}, params) {
  let businessIDs = []
  if (params.list.length == 0) {
    return []
  }
  params.list.forEach((item) => {
    businessIDs.push(item[params.primaryKey])
  })
  return new Promise((resolve, reject) => {
    axios({
      url: 'api-fsm/workbench/instance/fsmInstance/opts',
      method: 'GET',
      data: {
        modelCode: params.modelCode,
        businessIDs: businessIDs
      }
    }).then((res) => {
      if (res.data.code == 2000) {
        //设置结果
        params.list.forEach((item) => {
          let opts = res.data.data.filter((optData) => {
            return optData.businessID == item[params.primaryKey]
          })
          item.optList = opts.length != 0 ? opts[0].optList : [] //操作列表
          item.businessState = opts.length != 0 ? opts[0].businessState : '' //业务状态
          item.stateName = opts.length != 0 ? opts[0].stateName : '' //状态名称
        })
        resolve(params.list)
      } else {
        reject(res)
      }
    })
  })
}
