import Schema from 'async-validator'
export default {
  //行内编辑校验
  methods: {
    validateInline (items) {
      if (!this.rules) return
      let validator = new Schema(this.rules)
      return new Promise((resolve, reject) => {
        validator.validate(items, (errors, fields) => {
          //初始化
          items.errorQueue && (items.errorQueue = null)
          if (!errors) {
            resolve()
            return
          }
          errors.forEach(item => {
            this.$set(items, 'errorQueue', Object.assign(items.errorQueue || {}, {
              [item.field]: true
            }))
          })
          this.$Message.error(errors[0].message)
          /* eslint-disable*/
          reject(false)
        })
      })
    }
  }
}
