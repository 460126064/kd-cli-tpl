import axios from '@/plugins/axios'
import * as tipsConf from '@/config/tips-conf'
class Pipe {
  LRU = []
  //4M内存
  SIZE = 2097152
  //获取最后一个元素内容
  getLastNode () {
    return this.LRU[this.LRU.length - 1]
  }
  add (key, val) {
    let length = ~~(localStorage.SIZE || (localStorage.SIZE = 0))
    let dLength = val.length
    if (length + dLength > this.SIZE) {
      //更新管道
      this.updateNode(key, val)
      return
    }
    //更新管道
    this.addNode(key, val)
  }
  addNode (key, val) {
    localStorage.setItem(key, val)
    localStorage.SIZE = ~~localStorage.SIZE + val.length
    this.LRU.unshift(key)
  }
  removeLastNode () {
    let item = this.LRU.pop()
    localStorage.SIZE = ~~localStorage.SIZE - (localStorage[item]?.length || 0)
    localStorage.removeItem(item)
  }
  update (key) {
    let target = this.LRU.indexOf(key)
    //不存在直接push
    if (target === -1) {
      this.LRU.unshift(key)
      return
    }
    //存在做移动
    this.LRU.unshift(...this.LRU.splice(target, 1))
  }
  updateNode (key, val) {
    let lastNode = this.getLastNode()
    let length = ~~(localStorage.SIZE || (localStorage.SIZE = 0))
    let lastLength = localStorage[lastNode]?.length || 0
    let dLength = val.length
    let condition = (length + dLength - lastLength) > this.SIZE
    !condition && this.removeLastNode()
    while (condition) {
      this.removeLastNode()
      lastNode = this.getLastNode()
      condition = (length + dLength - lastLength) > this.SIZE
    }
    this.addNode(key, val)
  }
}
class DB {
  flag = {}
  constructor () {
    this.pipe = new Pipe()
  }
  setDB (key, val) {
    this.pipe.add(key, val)
  }
  getDB (c, url = 'mock/5d91a8244a9da91cd653fbca/basetips') {
    let d = localStorage[c]
    if (d) {
      this.pipe.update(c)
      return Promise.resolve(JSON.parse(d))
    }
    //请求节流
    if (this.flag[c]) return Promise.resolve(false)
    this.flag[c] = true
    return axios({
      url,
      method: 'GET',
      data: {
        code: c
      }
    }).then(({ data }) => {
      let d = data.data
      //本地存储
      this.setDB(c, JSON.stringify(d))
      this.flag = {}
      return d
    }).catch(() => {
      this.flag = {}
    })
  }
}
class Utils {
  trnasformKebabCase (value = '') {
    return value.replace(/([A-Z])/g, (match, $1) => `-${$1.toLowerCase()}`)
  }
}
/* eslint-disable*/
let db = new DB()
let utils = new Utils()
//为动态展示埋点
export const asyncLoadTips = function (name) {
  return import(`@/config/tips-conf/${utils(name)}/index.js`).then((res) => {
    return res.default
  })
}
export default {
  data () {
    return {
      tips: Object.freeze(tipsConf[this ?.$route ?.name] || {})
    }
  },
  watch: {
    '$store.state.tips': {
      handler (val) {
        if (this._inactive) return
        this.tips = val
      }
    }
  },
  created() {
    this.$changeTips()
    // if (!this.$route || !this.$options.name || this.$route.name !== this.$options.name) return
    // db.getDB(this.$route.name).then((res) => {
    //   if (!res) return
    //   //值合并，只做一层
    //   let tips = this.$store.state.tips
    //   let keys = Object.keys(res)
    //   keys.forEach(key => {
    //     Object.assign((tips[key] || (tips[key] = {})), res[key])
    //   })
    //   this.$store.commit('TIPS', this.tips)
    // })
    //先取默认值
    // this.$store.commit('TIPS', Object.freeze(tipsConf[this.$route.name] || {}))
  },
  activated () {
    this.$changeTips()
  },
  methods: {
    $changeTips () {
      if (!this.$route || !this.$options.name || this.$route.name !== this.$options.name) return
      let tips = Object.freeze(tipsConf[this.$route.name] || {})
      this.$store.commit('TIPS', tips)
    }
  }
}
