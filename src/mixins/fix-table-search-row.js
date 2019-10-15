export default {
  mounted () {
    this.checkFixSearchRow() && this.fixSearchRowCheckbox()
  },
  updated () {
    this.checkFixSearchRow() && this.fixSearchRowCheckbox()
  },
  methods: {
    checkFixSearchRow () {
      return !this.disabledDrag || this.showSelect || this.showSort
    },
    fixSearchRowCheckbox () {
      const td = this.$el.querySelector('.ivu-table-tbody tr td .ivu-table-cell')
      const replaceEl = td && td.children[0]
      if (!replaceEl) return
      const icon = document.createElement('i')
      icon.className = 'ivu-icon ivu-icon-search iv-fs-20'
      td.replaceChild(icon, replaceEl)
    }
  }
}
