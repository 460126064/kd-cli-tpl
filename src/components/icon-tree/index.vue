<template>
  <div class="iv-icontree-wrapper">
    <div>
      <Select
        :class="showSpread ? 'iv-fullwidth' : ''"
        class="iv-filterable-select"
        @on-change="onSearchChange"
        transfer
        filterable>
        <Option v-for="(opt, index) in selectOptionList"
                :value="opt.value"
                :key="index">
          <span class="iv-fs-12">{{opt.label}}</span>
        </Option>
      </Select>
      <IconFont
        v-if="showSpread"
        @click="changeTreeWidth"
        class="iv-icon-spread iv-fs-18 iv-pointer iv-hover-color"
        :type="treeCollapse ? 'outdent' : 'indent'"></IconFont>
    </div>
    <Tree
      ref="Tree"
      @on-select-change="onNativeSelectChange"
      :data="inData"></Tree>
  </div>
</template>
<script>
import render from './render'
import IconFont from '@/components/iconfont'
import {findComponentUpward} from '@/utils'
import collapseTreeMixin from '@/mixins/collapse-tree'
export default {
  mixins: [collapseTreeMixin],
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    getTitle: {
      type: Function,
      default (title) {
        return title
      }
    },
    showType: {
      type: [String, Array],
      default: 'icon'
    },
    iconMap: {
      type: Object,
      default () {
        return {
          'ORG': 'file-company',
          // 'POST': 'deploymentunit',
          'POST': 'file-job',
          'POSITION': 'user'
        }
      }
    },
    iconType: {
      type: String,
      default: 'orgType'
    },
    showExtend: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    showSpread: {
      type: Boolean,
      default: true
    },
    showCheckBox: {
      type: [Boolean, Function],
      default: false
    },
    showSingleCheck: {
      type: [Boolean, Function],
      default: false
    },
    reloadTable: {
      type: Boolean,
      default: true
    },
    treeMap: {
      type: Object,
      default () {
        return {
          title: 'title'
        }
      }
    },
    value: {
      type: [Number, String],
      default: ''
    },
    className: {
      type: Function,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      inData: [],
      treeData: [], //存储原始树结构数据
      searchData: [],
      currentSelect: '',
      selectOptionList: [],
      treeMapIndex: 0,
      treeMapValue: '',
      refTreeFlatState: undefined
    }
  },
  created () {
    this.render = render.call(this)
    this.inData = [this.transferData(this.data[0] || {})]
    this.getTreeMap(this.treeData, '', '')
  },
  mounted () {
    this.findTreeList = findComponentUpward(this, ['InlineTreeList', 'TreeList'])
  },
  watch: {
    data (newVal) {
      this.inData = [this.transferData(newVal[0] || {})]
      this.treeData = [...this.inData]
      this.selectOptionList = []
      this.getTreeMap(this.treeData, '', '')
    }
  },
  components: {
    IconFont
  },
  methods: {
    getTreeMap (arr, index, title) {
      let l = arr.length
      for (let i = 0; i < l; i++) {
        let children = arr[i].children
        let modal = {
          label: title + arr[i][this.treeMap.title],
          value: index + i
        }
        arr[i].path = index + i
        this.selectOptionList.push(modal)
        if (children && children.length) {
          let value = ''
          let NTitle = ''
          !this.treeMapIndex ? (value = i + '>') : (value = `${index}${i}>`)
          !this.treeMapIndex ? (NTitle = arr[i][this.treeMap.title] + '>') : (NTitle = `${title}${arr[i][this.treeMap.title]}>`)
          this.treeMapIndex++
          this.getTreeMap(children, value, NTitle)
        }
      }
    },
    getTreeNode (tree, saveList) {
      let parent = tree.parent
      if (parent || parent === 0) {
        let node = {...this.refTreeFlatState[parent].node}
        let nextTree = this.refTreeFlatState[parent]
        if (!saveList) {
          let curNode = {...tree.node}
          curNode.expand = true
          node.children = [curNode]
          saveList = node
        } else {
          let curNode = {...saveList}
          curNode.expand = true
          node.children = [curNode]
          saveList = node
        }
        this.getTreeNode(nextTree, saveList)
      } else {
        if (!saveList) {
          this.inData = [{...this.refTreeFlatState[0].node}]
        } else {
          this.inData = [saveList]
        }
      }
    },
    onSelectChange (root, node, data) {
      if (data.disabled) return
      root.forEach(({node}) => (node.selected = node === data))
      this.currentSelect = data
      if (this.reloadTable) {
        let TreeList = this.findTreeList
        TreeList.$methods('Table', 'setParams', Object.assign({
          [TreeList.treeMap.id]: TreeList.dataTree[0] ? TreeList.dataTree[0][TreeList.treeMap.value || 'id'] : ''
        }, TreeList.params))
        this.$nextTick(() => {
          TreeList.$refs.Edit && TreeList.$methods('Edit', 'setNode', data)
        })
      }
      this.$emit('on-select-change', [data], node, root)
    },
    onNativeSelectChange (currentNode, root, data) {
      root && this.onSelectChange(root, data, data)
    },
    onIconExtend (e) {
      e.stopPropagation()
    },
    onChange (isCheckd, root, node, data) {
      this.$emit('on-check-change', ...arguments)
      if (this.showSingleCheck) {
        if (node.children && node.children.length) return
        this.onSingleCheck(...arguments)
        return
      }
      this.$refs.Tree.handleCheck({
        checked: !data.checked && !data.indeterminate,
        nodeKey: data.nodeKey
      })
    },
    onSingleCheck (isCheckd, root, node, data) {
      root.forEach(({node}) => {
        let isCheck = node === data
        this.$set(node, 'checked', isCheck)
        this.$set(node, 'selected', isCheck)
      })
    },
    getSelectedNodes () {
      return this.$refs.Tree.getSelectedNodes()
    },
    getCheckedNodes () {
      return this.$refs.Tree.getCheckedNodes()
    },
    transferData (data) {
      let queue = [data]
      while (queue.length) {
        let item = queue.shift()
        if (item.children && item.children.length) {
          queue.push(...item.children)
        }
        item.render = this.render
        if (item.id == this.value) {
          item.checked = true
        }
      }
      return data
    },
    onSearchChange (v) {
      !this.refTreeFlatState && (this.refTreeFlatState = [...this.$refs.Tree.flatState])
      let selectTree = this.refTreeFlatState.find(item => item.node.path === v)
      this.getTreeNode(selectTree)
    }
  }
}
</script>
<style lang="scss" scoped>
  .iv-icontree-wrapper {
    position: relative;
    .iv-filterable-select {
      &.iv-fullwidth {
        padding-right: 24px;
      }
    }
    .iv-icon-spread {
      position: absolute;
      right: 0;
      top: 3px;
    }
    /deep/ .iv-icon-wrapper {
      padding: 2px 4px;
    }
    /deep/ .iv-tree-selected  {
      background: #d5e8fc;
      border-radius: 2px;
    }
    /deep/ .iv-icon {
      position: relative;
      top: 2px;
      margin-right: 4px;
    }
    /deep/ .iv-icon-extend {
      position: relative;
      top: 1px;
      left: 4px;
    }
  }
</style>
