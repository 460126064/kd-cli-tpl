export default {
  inject: {
    onOperatorClick: {
      default () {
        return function () {}
      }
    }
  },
  methods: {
    //获取table对应columns
    getCol () {
      if (this.configUrl) {
        return this.remoteColumns
      }
      return this.columns
    },
    getColumns (list) {
      this.remoteColumns = this.initColumns(list)
    },
    //合并配置操作列
    initColumns (data = []) {
      let dataList = [], i = -1, operateIndex = 0, list
      data.data && data.data.slice(0, 1).map(item => {
        list = ((item.attributes) || []).reduce((cur, next) => {
          i++
          if (next.type == 'opt') {
            if (cur[operateIndex] && cur[operateIndex].title === '操作') {
              cur[operateIndex].render(next)
              return cur
            }
            operateIndex = i
            dataList.push(next)
            cur.push({
              title: '操作',
              minWidth: 100,
              render: (h, params) => {
                if (typeof h === 'object') return dataList.push(h)
                const list = dataList.map(item => {
                  return (
                    <li onClick={this.onOperatorClick.bind(this, params, item.attrCode)}
                      class="iv-operate-item iv-pull-left iv-hover-color iv-main-color iv-pointer">
                      {item.displayName || item.title}
                    </li>
                  )
                })
                return (
                  <ul class="iv-operate-wrapper">
                    {list}
                  </ul>
                )
              }
            })
            return cur
          }
          next.minWidth = 100
          next.title = next.displayName || next.title
          cur.push(next)
          return cur
        }, [])
      })
      // operatorList

      // 确保操作总在最后
      if (list && list.length - 1 !== operateIndex) {
        list.push(...list.splice(operateIndex, 1))
      }
      list && (list[0].fixed = 'left')
      return list
    },
    operateClick () {
      console.log(arguments)
    }
  }
}
