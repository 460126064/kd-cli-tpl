import idCardValidate from './validate/card-validate'
/**
 * @constructor {Function} 身份证表单校验
 */
export const idCard = {
  validator (rule, value, resolve) {
    let valid = idCardValidate(value)
    if (valid) return resolve()
    resolve(new Error('身份证校验失败'))
  },
  trigger: 'blur'
}
/**
 * @constructor {Function} 邮箱表单校验
 */
export const email = {
  validator (rule, value, resolve) {
    let reg = /^[a-z0-9](\w|\.|-)*@([a-z0-9]+-?[a-z0-9]+\.){1,3}[a-z]{2,4}$/i
    let valid = reg.test(value)
    if (valid) return resolve()
    resolve(new Error('邮箱校验失败'))
  },
  trigger: 'blur'
}
/**
 * @constructor {Function} 手机号表单校验
 * 手机号校验更新到2018年10月，支持最新的166号段
 */
export const phoneNumber = {
  validator (rule, value, resolve) {
    let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    let valid = reg.test(value)
    if (valid) return resolve()
    resolve(new Error('手机号校验失败'))
  },
  trigger: 'blur'
}
