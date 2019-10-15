import {createSortable} from '@/utils'
export default {
  watch: {
    dataTable (newVal = []) {
      if (this.disabledDrag || !newVal.length) return
      if (!this.sortableInstance) {
        this._el = document.querySelector(`.${this.uniClass} .ivu-table-tbody`)
        this._el.style.cursor = 'pointer'
        this.sortableInstance = createSortable(this._el, {
          handle: `.${this.sortableHandle}`,
          filter: '.ivu-input',
          preventOnFilter: false,
          onMove: (evt, origin) => {
            let idx = this.findIndex(evt.from, evt.dragged)
            let item
            if (!idx || idx === 1) return false
            item = this.dataTable[idx - 1]
            if (item._isAdd) return false
          },
          onEnd: (evt) => {
            if (evt.newIndex === evt.oldIndex) return
            //兼容provide传值
            this.setSortIndex(evt.oldIndex, evt.newIndex + 1, this.dataTable[evt.oldIndex])
            //兼容$on传值
            this.$emit('setSortIndex', {
              index: evt.oldIndex,
              value: evt.newIndex + 1,
              row: this.dataTable[evt.oldIndex]
            })
          }
        })
      }
    }
  },
  methods: {
    findIndex (paernts, child) {
      let children = paernts.children
      let findIdx
      if (!children || !children.length) return
      [...children].some((item, index) => {
        if (item === child) {
          findIdx = index
          return true
        }
      })
      return findIdx
    }
  }
}
