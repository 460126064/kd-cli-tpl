<script>
import Page from '@/components/page'
import {mapGetters, mapMutations} from 'vuex'
import dragMixins from '@/mixins/drag-table'
import fixTableSearchRow from '@/mixins/fix-table-search-row'
import {columns} from './table'
import {interceptorFactory} from '@/utils'
const defaultInterceptor = {
  request: {
    resolve: () => {}
  },
  response: {
    resolve: (data) => { return data }
  }
}
export default {
  mixins: [dragMixins, fixTableSearchRow],
  props: {
    disabledDrag: {
      type: Boolean,
      default: true
    },
    sortableHandle: {
      type: String,
      default: 'ivu-table-row'
    },
    showPage: {
      type: Boolean,
      default: true
    },
    showSort: {
      type: Boolean,
      default: false
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
    params: {
      type: Object,
      default () {
        return {}
      }
    },
    cacheColumns: {
      type: Boolean,
      default: true
    },
    rowCheck: {
      type: Boolean,
      default: false
    }
  },
  inject: {
    /**
     * @description 自定义表格显示区域视图
     * @return {Object} component：渲染的组件； props：组件需要的props对象；
     */
    customTableView: {
      default () {
        return function () {
          return {
            component: undefined,
            props: undefined
          }
        }
      }
    },
    setSortIndex: {
      default () {
        return function () {}
      }
    },
    getTableHeight: {
      default () {
        return function () {
          return {}
        }
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
      tottal: 1
    }
  },
  watch: {
    data (newVal) {
      this.dataTable = newVal
    },
    params: {
      handler () {
        this.currentPage = 1
        this.interceptorList.exec()
      }
    },
    disabledDrag (newVal) {
      if (newVal) {
        this.sortableInstance && this.sortableInstance.destroy()
        this.sortableInstance = null
        this._el && (this._el.style.cursor = 'initial')
      }
    }
  },
  render (c) {
    const {component, props} = this.customTableView()
    if (component) {
      return c(component, props)
    }
    // Table节点
    this.$attrs.columns = columns.call(this, this.$attrs.columns)
    const TableVnode = c('Table', {
      class: this.uniClass,
      attrs: Object.assign({}, this.$attrs, this.$options.propsData, {
        loading: this.loading,
        stripe: true,
        border: true,
        data: this.data,
        ...this.getTableHeight()
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
        }
      }
    })
    // Page节点
    const PageVnode = this.data.length && this.showPage ? c(Page, {
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
  computed: {
    ...mapGetters({
      storePageSize: 'pageSize'
    })
  },
  components: {
    Page
  },
  created () {
    this.currentPage = 1
    this.createdInterceptor()
  },
  methods: {
    ...mapMutations({
      mutationPageSize: 'PAGE_SIZE'
    }),
    createdInterceptor () {
      this.interceptorList = interceptorFactory({
        request: {
          resolve: () => {
            return Promise.resolve().then(() => {
              return (this.interceptor.request || defaultInterceptor.request).resolve(this.params)
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
              return (this.interceptor.response || defaultInterceptor.response).resolve(data)
            }).then(({data}) => {
              let arr = this.getResChain(data.data)
              arr.unshift({})
              this.data = arr
              this.total = data.count || data.data.count
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
    getResChain (data) {
      while (!Array.isArray(data)) {
        switch (typeof data) {
          case 'object':
            data = data.resultList
            break
          default:
            console.warn(`${data} must be an array`)
            return []
        }
      }
      return data
    },
    getList (params = {}) {
      this.loading = true
      return this.$ajax({
        url: this.url,
        method: this.method,
        data: Object.assign(this.$attrs.listData || {}, {
          currentPage: this.currentPage,
          pageSize: this.$attrs.pageSize || this.storePageSize
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
    //向外暴露渲染方法
    renderList () {
      return this.interceptorList.exec()
    }
  }
}
</script>
<style lang="scss" scoped></style>
