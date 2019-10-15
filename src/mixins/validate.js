export default {
  methods: {
    /*
    * @description {Function} 表单校验
    * @param {String} 表单ref对应值
    * @param {Function} 校验成功回调
    * @return {Object} Promise对象
    */
    validate (ref, callback) {
      return Promise.resolve().then(() => {
        if (Array.isArray(this.$refs[ref])) {
          return Promise.all(this.$refs[ref].map(item => item.validate()))
            .then(arr => {
              if (arr.indexOf(false) > -1) return false
              return true
            })
        }
        return this.$refs[ref].validate()
      }).then((validate) => {
        if (!validate) {
          this.$Message.error('表单校验未通过')
          return Promise.resolve(validate)
        }
        callback && callback.apply(this)
        return Promise.resolve(validate)
      })
    }
  }
}
