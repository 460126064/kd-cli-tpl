//职责链构造函数
const DutyChainPattern = function (fn) {
  this.queue = []
  //注册职责链
  this.$add(fn)
}
DutyChainPattern.prototype = {
  constructor: DutyChainPattern,
  //忽略数组形式，保持职责单一，此处保留数组形式
  $add (fn) {
    this.queue.push(fn)
  },
  setNext (patternInstance) {
    if (!(patternInstance instanceof DutyChainPattern)) {
      this.console('error', 'param must be DutyChainPattern instance')
      return false
    }
    this.nextInstance = patternInstance
  },
  exec () {
    return Promise.resolve().then((res) => {
      for (let item of this.queue) {
        //执行职责链中回调
        let res = item && item.apply(this, arguments)
        //判断职责是否匹配,next为不匹配
        if (typeof res === 'string' && res === 'next') {
          return this.nextInstance && this.nextInstance.exec.apply(this.nextInstance, arguments)
        } else if (typeof res === 'object' && typeof res.then === 'function') {
          //判断返回值是否为Promise，考虑兼容性，暂不做native Promise判断
          //根据Promise A+规范，暂只判断then方法
          return res.then(($res) => {
            if (typeof $res === 'string' && $res === 'next') {
              return this.nextInstance && this.nextInstance.exec.apply(this.nextInstance, arguments)
            }
            return $res
          })
        } else {
          //返回成功结果
          return res
        }
      }
    })
  }
}
export default DutyChainPattern
