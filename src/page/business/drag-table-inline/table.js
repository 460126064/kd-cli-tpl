import Operate from '@/components/table-operate'
import InlineEdit from '@/components/inline-edit'
import StatusCard from 'components/status-card'
import searchRow from './search'
//是否是
function isString (value) {
  return typeof value === 'string'
}
export const columnsTable = function (columnsData) {
  //初始化数据
  let initSort = this.showSort ? [{
    title: '序号',
    width: 60,
    key: '_sort',
    noSearch: true,
    isEdit: true,
    isFireBlur: true,
    ...(this.fixedSort ? {
      fixed: isString(this.fixedSort) ? this.fixedSort : 'left'
    } : {})
  }] : []

  let dragIcon = {
    drag: true,
    title: ' ',
    width: 48,
    align: 'center',
    ...(this.fixedDrag ? {
      fixed: isString(this.fixedDrag) ? this.fixedDrag : 'left'
    } : {}),
    render (c) {
      return c('Icon', {
        props: {
          type: 'arrow-move'
        }
      })
    }
  }

  let initColumnsTable = this.showSelect
    ? [{
      type: 'selection',
      width: 48,
      align: 'center',
      ...(this.fixedSelection ? {
        fixed: isString(this.fixedSelection) ? this.fixedSelection : 'left'
      } : {})
    }]
    : !this.disabledDrag
      ? (initSort.push(dragIcon), [])
      : []
  const noSearch = this.noSearch
  //循环遍历参数配置render函数
  initSort.concat(columnsData).forEach(item => {
    let isRender = item.isEdit || item.isOperate || typeof item.render === 'function' || item.showType === 'searchTree' || item.isProgress || item.isCard
    // 设置单元格默认最小宽度
    !item.minWidth && !item.width && (item.minWidth = 100)
    // 设置拖拽列宽
    item.resizable = true
    // 设置宽度，为了增加拖拽响应式
    item.width = item.width || 'auto'
    initColumnsTable.push({
      ...item,
      render: isRender
        ? (c, params) => {
          if (params.index !== 0 || noSearch) {
            //如果是传入的render函数，优先级为最高
            if (item.render) {
              if (item.tooltip) {
                const vNode = item.render.apply(this, [c, params])
                // 如果后端返回的值为空 不渲染tooltip
                if (!vNode.children?.[0]?.text) {
                  return c('span', '')
                }
                const slotNode = Object.create(vNode)
                slotNode.data = {
                  slot: 'content',
                  class: 'iv-table-tooltip-content'
                }
                return c('Tooltip',
                  {
                    class: item.class,
                    props: {
                      transfer: true
                    }
                  },
                  [
                    slotNode,
                    vNode
                  ])
              }
              return item.render.apply(this, [c, params])
            }
            let isEdit = params.row.isEdit
            //判断索引值
            if (item.key === '_sort') {
              let currentPage = this.currentPage
              let pageSize = this.$attrs.pageSize || this.storePageSize
              params.row[item.key] = pageSize * (currentPage - 1) + (params.index)
              isEdit = params.row.sort
            }
            // 进度条
            if (item.isProgress) {
              let progress
              if (typeof item.isProgress === 'function') {
                progress = item.isProgress(item)
              } else {
                progress = parseFloat(params.row[item.key])
              }
              if (!progress && progress !== 0) {
                return c('span', '')
              }
              return c('div', [
                c('div', {
                  style: {'text-align': 'center'}
                }, `${progress}%`),
                c('Progress', {
                  props: {
                    percent: progress,
                    'hide-info': true,
                    'stroke-width': 5,
                    ...item.props
                  }
                })
              ])
            }
            // 卡片视图
            if (item.isCard) {
              const statusCardList = []
              item.setData(params).forEach(item => {
                statusCardList.push(c(StatusCard, {
                  props: {
                    ...item
                  },
                  style: {
                    margin: '0px 0 8px 8px'
                  }
                }))
              })
              return c('div', {
                style: {margin: '8px 0 0 -8px'}
              }, statusCardList)
            }
            //isEdit可能为动态展示
            isEdit = isEdit && typeof item.isEdit === 'function' ? item.isEdit.call(this, params) : isEdit
            return c(item.isOperate ? Operate : InlineEdit, {
              props: {
                item: params.row,
                type: item.key,
                index: params.index,
                showDelete: this.showDelete,
                showEdit: this.showEdit,
                showSave: this.showSave,
                showType: item.showType,
                optionList: item.optionList,
                singelEdit: item.singelEdit,
                props: item.props,
                prepend: item.prepend,
                textRender: item.textRender,
                handler: item.handler,
                list: item.list,
                isOutside: false,
                //向下兼容，忽略此属性
                compatible: this.compatible,
                deleteTitle: this.$attrs.deleteTitle,
                isEdit: isEdit,
                ...(item.isFireBlur ? {
                  isFireBlur: item.isFireBlur
                } : {})
              },
              on: {
                'on-remote': (pro) => {
                  this.onRemote(pro)
                }
              }
            }, [item.slotComponent ? c(item.slotComponent || {}, {
              props: {
                item: params.row,
                index: params.index
              },
              slot: 'operate'
            }) : c('')])
          }
          // 第一行为搜索框
          return searchRow.call(this, c, params)
        }
        : (c, params) => {
          if (params.index !== 0 || noSearch) {
            if (item.tooltip) {
              return params.row[item.key]
                ? c('Tooltip',
                  {
                    class: item.class,
                    props: {
                      transfer: true
                    }
                  },
                  [
                    c('span', {
                      slot: 'content',
                      class: 'iv-table-tooltip-content'
                    }, params.row[item.key]),
                    params.row[item.key]
                  ])
                : c('span', '')
            }
            return c('span', params.row[item.key])
          }
          // 第一行为搜索框
          return searchRow.call(this, c, params)
        }
    })
  })
  return initColumnsTable
}
