<template>
  <TreeList
    :showTree="false"
    listUrl="list"
    :operationList="operationList"
    :columns="columns"
  />
</template>
<script>
import TreeList from '@/page/business/inline-tree-list'
import table from './table'
import operationList from './operation'
export default {
  props: {},
  data () { return {} },
  components: {
    TreeList
  },
  created () {
    this.columns = table
    this.operationList = operationList.call(this)
    this.data = [{
      filed1: '字段1',
      filed2: '字段2',
      filed3: '字段3'
    }]
  },
  methods: {
    add () {
      this.$router.push({
        name: 'secondMenuInfo'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
