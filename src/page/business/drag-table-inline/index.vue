<script>
import Page from '@/components/page'
import {columnsTable} from './table'
import {mapGetters, mapMutations} from 'vuex'
import dragMixins from '@/mixins/drag-table'
import {interceptorFactory} from '@/utils'
export default {
  mixins: [dragMixins],
  props: {
    noSearch: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    showPage: {
      type: Boolean,
      default: true
    },
    showSelect: {
      type: Boolean,
      default: true
    },
    showSort: {
      type: Boolean,
      default: false
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    fixedSelection: {
      type: Boolean,
      default: false
    },
    fixedDrag: {
      type: Boolean,
      default: false
    },
    fixedSort: {
      type: [Boolean, String],
      default: false
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    showSave: {
      type: Boolean,
      default: true
    },
    disabledDrag: {
      type: Boolean,
      default: true
    },
    sortableHandle: {
      type: String,
      default: 'ivu-table-row'
    },
    //向下兼容，忽略此属性
    compatible: {
      type: Boolean,
      default: true
    },
    method: {
      type: String,
      default: 'GET'
    },
    url: {
      type: String,
      required: true,
      default: ''
    },
    rowCheck: {
      type: Boolean,
      default: false
    }
  },
  inject: {
    setSortIndex: {
      default () {
        return function () {}
      }
    },
    interceptor: {
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      uniClass: `iv-sortable-${this._uid}`,
      dataTable: [],
      loading: true,
      data: [],
      tottal: 1,
      privateColumns: null,
      columnsTable: []
    }
  },
  computed: {
    ...mapGetters({
      storePageSize: 'pageSize'
    })
  },
  components: {
    Page
  },
  created () {
    this.params = {}
    this.currentPage = 1
    this.requestCount = []
    this.defaultInterceptor = {
      request: {
        resolve: () => {}
      },
      response: {
        resolve: (data) => {
          if (!this.noSearch) {
            if (data.data.data) {
              data.data.data = [{}, ...data.data.data]
            }
          }
          return data
        }
      }
    }
    this.createdInterceptor()
  },
  mounted () {
    this.checkFixSearchRow() && this.fixSearchRowCheckbox()
    this.$attrs.immediate && this.forceRender()
  },
  updated () {
    this.checkFixSearchRow() && this.fixSearchRowCheckbox()
  },
  watch: {
    data (newVal) {
      // 行内新增时 新增行和搜索行交换
      if ((newVal[0] && newVal[0]._isAdd) && (newVal[1] && !newVal[1]._isAdd)) {
        [newVal[0], newVal[1]] = [newVal[1], newVal[0]]
      }
      if (newVal) {
        this.dataTable = newVal
      }
    },
    disabledDrag (newVal) {
      if (newVal) {
        this.sortableInstance && this.sortableInstance.destroy()
        this.sortableInstance = null
      }
    },
    columns: {
      handler () {
        this.columnsTable = columnsTable.apply(this, [this.privateColumns || this.columns])
      },
      immediate: true
    }
  },
  render (c) {
    const TableVnode = c('Table', {
      class: `${this.uniClass} ${this.noSearch ? 'iv-drag-table iv-drag-table-no-search' : 'iv-drag-table iv-drag-table-has-search'}`,
      ref: 'Table',
      attrs: Object.assign({}, this.$attrs, this.$options.propsData, {
        loading: this.loading,
        border: true,
        stripe: false,
        data: this.data,
        columns: this.columnsTable
      }),
      on: {
        'on-selection-change': (list) => {
          this.tableSelectChange(list)
        },
        'on-select-cancel': (list, row) => {
          this.$emit('on-select-cancel', list, row)
        },
        'on-select': (list, row) => {
          this.$emit('on-select', list, row)
        },
        'on-select-all': (list) => {
          this.$emit('on-select-all', list)
        },
        'on-row-click': (list, row) => {
          this.rowCheck && TableVnode.componentInstance.toggleSelect(row)
          this.$emit('on-row-click', list, row)
        },
        'on-column-width-resize': (newWidth, oldWidth, column, event) => {
          //带iview4.0BUG修复后，再从设置columns的拖拽宽度
          this.$emit('on-column-width-resize', newWidth, oldWidth, column, event)
        }
      }
    })
    // Page节点
    const PageVnode = this.data && this.data.length && this.showPage ? c(Page, {
      class: '',
      attrs: Object.assign({}, this.$attrs, {
        pageSize: this.$attrs.pageSize || this.storePageSize,
        total: this.total,
        current: this.currentPage
      }),
      on: {
        'on-page-size-change': (pageSize) => {
          this.changePageSize(pageSize)
        },
        'on-change': (page) => {
          this.changePage(page)
        }
      }
    }) : c('div')

    return c('div', {}, [TableVnode, PageVnode])
  },
  methods: {
    ...mapMutations({
      mutationPageSize: 'PAGE_SIZE'
    }),
    setUrl (url) {
      this._url = url
    },
    setColumns (columns) {
      this.privateColumns = columns
      this.columnsTable = columnsTable.apply(this, [this.privateColumns || this.columns])
    },
    setParams (params) {
      this.params = params
      this.currentPage = 1
      this.interceptorList.exec()
    },
    checkFixSearchRow () {
      if (this.noSearch) return false
      return !this.disabledDrag || (this.showSelect && this.data[0] && !this.data[0]._isAdd) || this.showSort
    },
    fixSearchRowCheckbox () {
      const td = this.$el.querySelector('.ivu-table-tbody tr td .ivu-table-cell')
      const replaceEl = td && td.children[0]
      if (!replaceEl) return
      const icon = document.createElement('i')
      icon.className = 'ivu-icon ivu-icon-search iv-fs-20'
      td.replaceChild(icon, replaceEl)
    },
    createdInterceptor () {
      this.interceptorList = interceptorFactory({
        request: {
          resolve: () => {
            return Promise.resolve().then(() => {
              return (this.interceptor.request || this.defaultInterceptor.request).resolve(Object.assign({}, this.params))
            })
          },
          reject: (this.interceptor.request || {}).reject
        },
        dispatch: {
          resolve: this.getList,
          response: undefined
        },
        response: {
          resolve: (data) => {
            return Promise.resolve().then(() => {
              return (this.interceptor.response || this.defaultInterceptor.response).resolve(data)
            }).then(({data}) => {
              this.data = data.data
              this.total = data.count
              this.loading = false
              //观察者触发
              this.$emit('on-list', this.data, data)
              return this.data
            })
          },
          reject: (this.interceptor.response || {}).reject
        }
      })
    },
    getList (params = {}) {
      this.loading = true
      return this.$ajax({
        url: this._url || this.url,
        method: this.method,
        data: Object.assign(this.$attrs.listData || {}, {
          current: this.currentPage,
          size: this.$attrs.pageSize || this.storePageSize
        }, this.params, params)
      })
    },
    tableSelectChange (list) {
      this.$emit('on-selection-change', list)
    },
    changePageSize (pageSize) {
      this.mutationPageSize(pageSize)
      this.$attrs.pageSize && (this.$attrs.pageSize = pageSize)
      this.interceptorList.exec()
      this.$emit('on-page-size-change', pageSize)
    },
    changePage (page) {
      this.currentPage = page
      this.interceptorList.exec()
      //向下兼容
      this.$emit('on-change', page)
      //与iview保持一致
      this.$emit('on-page-change', page)
    },
    onRemote ({request, vm}) {
      //排除内部调用
      request && this.requestCount.push(vm)
      if (!this.request) {
        this.request = request()
      }
      //成功情况下，清空引用
      this.request.then((data) => {
        this.requestCount.forEach(item => {
          item.inOptionList = data
        })
        //清空引用
        this.request = null
        this.requestCount.length = 0
      }).catch((a) => {
      //失败情况下，继续发送
        if (!this.requestCount.length) return
        this.requestCount.shift()
        this.onRemote()
      })
    },
    forceRender () {
      this.currentPage = 1
      this.interceptorList.exec()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
