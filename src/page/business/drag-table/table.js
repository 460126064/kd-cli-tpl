import Operate from '@/components/table-operate'
import InlineEdit from '@/components/inline-edit'
import searchRow from '@/page/business/drag-table-inline/search'
//缓存数据
const cache = {}
class Strategy {
  constructor () {
    this.strategyList = {}
  }
}
class SubStrategy extends Strategy {
  constructor () {
    super('')
  }
  add (key, fn) {
    if (this.strategyList[key]) {
      console.warn(`${key} must be overwrite`)
    }
    this.strategyList[key] = fn
  }
  exec (context, key) {
    if (!this.strategyList[key]) {
      console.warn(`${key} not exist`)
      return
    }
    let args = [...arguments]
    return this.strategyList[key].apply(context, args.slice(2))
  }
}
let subStrategy = new SubStrategy()
//复选框
subStrategy.add('selection', function (item) {
  item.align = 'center'
  item.width = 48
})
//排序
subStrategy.add('_sort', function (item) {
  item.render = (c, params) => {
    let isEdit = params.row.sort
    let currentPage = this.currentPage
    let pageSize = this.$attrs.pageSize || this.storePageSize
    params.row[item.key] = pageSize * (currentPage - 1) + (params.index + 1)
    return c(InlineEdit, {
      props: {
        item: params.row,
        type: item.key,
        index: params.index,
        showType: item.showType,
        optionList: item.optionList,
        singelEdit: item.singelEdit,
        props: item.props,
        isOutside: false,
        //向下兼容，忽略此属性
        compatible: this.compatible,
        isEdit: isEdit,
        isFireBlur: item.isFireBlur
      }
    })
  }
})
subStrategy.add('operate', function (item) {
  return (c, params) => {
    return c(Operate, {
      attrs: {
        item: params.row,
        index: params.index,
        showDelete: this.$attrs.showDelete,
        showEdit: this.$attrs.showEdit,
        compatible: false
      }
    }, [c(item.slotComponent || {
      render (c) {
        return c('')
      }
    }, {
      props: {
        item: params.row,
        index: params.index
      },
      slot: 'operate'
    })])
  }
})
export const columns = function (columnsData) {
  if (cache[this._uid] && this.cacheColumns) return cache[this._uid]
  //初始化数据
  let initSort = this.showSort ? [{
    title: '序号',
    width: 60,
    key: '_sort',
    align: 'left',
    isEdit: true,
    isFireBlur: true
  }] : []
  let isFirstSelection = columnsData[0] && columnsData[0].type === 'selection'
  isFirstSelection ? columnsData.splice(1, 0, ...initSort) : initSort.concat(columnsData)
  this.showSort && (initSort[0].fixed = isFirstSelection ? columnsData[0].fixed : '')
  const renderColumnsData = []
  columnsData.forEach((item, index) => {
    if (item.isOperate) (item.render = subStrategy.exec(this, 'operate', item))
    if (item.type === 'selection') subStrategy.exec(this, 'selection', item)
    if (item.key === '_sort') subStrategy.exec(this, '_sort', item)
    renderColumnsData.push({
      ...item,
      render: (c, params) => {
        if (params.index !== 0) {
          if (item.render) {
            return item.render.apply(this, [c, params])
          }
          return c('span', params.row[item.key])
        }
        // 第一行为搜索框
        return searchRow.call(this, c, params)
      }
    })
  })
  cache[this._uid] = renderColumnsData
  return renderColumnsData
}
