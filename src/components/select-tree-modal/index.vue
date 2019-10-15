<template>
  <Modal
    v-model="val"
    :title="title"
    @on-cancel="onCacncel"
    @on-ok="onOK">
    <Row class="iv-wrapper">
      <Col span="12" class="iv-col">
        <h4 class="iv-fs-14 iv-fw-b iv-title">可选范围</h4>
        <IconTree
          ref="tree"
          :data="treeData"
          :get-title="getTitle"
          @on-check-change="onCheckChange"
          @on-select-change="onSelectChange"
          :showCheckBox="showCheckBox"
          v-bind="$attrs"
          v-on="$listeners"></IconTree>
      </Col>
      <Col span="12" class="iv-col">
        <h4 class="iv-fs-14 iv-fw-b iv-title">已选范围</h4>
        <IconTree
          class="iv-show-tree"
          :data="stateTree"
          :get-title="getTitle"
          :showCheckBox="showCheckBox"
          v-bind="$attrs"
          v-on="$listeners">
          <template #search-layout>
            <Alert style="height: 32px" show-icon>{{ $attrs.message || '请从左侧选择' }}</Alert>
          </template>
        </IconTree>
      </Col>
    </Row>
  </Modal>
</template>

<script>
import Modal from 'components/modal'
import IconTree from 'components/icon-tree'
import {Tree} from 'iview'
import {cloneDeep} from 'lodash'
export default {
  props: {
    getTitle: {
      type: Function,
      default (title) {
        return title
      }
    },
    title: {
      type: String,
      default: '选择组织'
    },
    value: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: 'governingRelationships/treeData'
    },
    data: {
      type: Array
    },
    params: {
      type: Object,
      default () {
        return {}
      }
    },
    showCheckBox: {
      type: [Boolean, Function],
      default: true
    }
  },
  data () {
    return {
      val: this.value,
      treeData: [],
      stateTree: []
    }
  },
  watch: {
    value (newVal) {
      this.val = newVal
      this.init()
      this.stateTree = []
    }
  },
  created () {
    this.init()
  },
  methods: {
    onCacncel () {
      this.$emit('input', false)
    },
    onOK () {
      this.$emit('on-ok', this.$refs.tree.getSelectedNodes(), this.$refs.tree.getCheckedNodes())
    },
    onCheckChange () {
      let stateTree = cloneDeep(this.$refs.tree.$refs.Tree.stateTree)
      this.stateTree = ergodic(stateTree)
      function ergodic (child) {
        let length = child.length - 1
        for (let i = length; i >= 0; i--) {
          if (!child[i].indeterminate && !child[i].checked) {
            child.splice(i, 1)
          }
          if (child[i] && child[i].children && child[i].children.length) {
            ergodic(child[i].children)
          }
        }
        return stateTree
      }
    },
    onSelectChange (...args) {
      this.$emit('on-select-change', ...args)
    },
    renderContent (h, { root, node, data }) {
      const _self = this
      return h('span', {
        on: {
          '!click': (e) => {
            e.stopImmediatePropagation()
            e.preventDefault()
            _self.$set(data, 'expand', !node.node.expand)
          }
        },
        class: node.node.checked || node.node.indeterminate ? 'iv-show' : 'iv-hide'
      }, [
        h('Icon', {
          style: {
            'display': (data.children && data.children.length) ? 'inline-block' : 'none',
            'margin-right': '2px'
          },
          props: {
            type: node.node.expand ? 'arrow-down-b' : 'arrow-right-b'
          }
        }),
        h('Checkbox', {
          style: {
            'padding': '0 4px'
          },
          props: {
            value: node.node.checked,
            indeterminate: node.node.indeterminate
          }
        }),
        h('span', {
          class: 'ivu-tree-title',
          style: {
            'padding': '0 4px'
          }
        }, data.title)
      ])
    },
    init () {
      if (this.data) {
        this.treeData = this.data
        this.treeData[0] && (this.treeData[0].expand = this.treeData[0].selected = true)
      } else {
        this.$ajax({
          url: this.url,
          method: 'GET',
          data: this.params
        }).then(({data}) => {
          this.treeData = data.data
          this.treeData[0] && (this.treeData[0].expand = this.treeData[0].selected = true)
        })
      }
    }
  },
  components: {
    Modal,
    IconTree,
    Tree
  }
}
</script>

<style lang="scss" scoped>
  @import 'variable/variable.scss';
  .iv-wrapper {
    padding: $two-double 0;

    /deep/ .iv-show {
      display: inline-block;
    }
    /deep/ .iv-hide {
      display: none;
    }
    /deep/ .iv-show-tree {
      position: relative;
      &:after {
        display: block;
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 10;
      }
    }
    /deep/ .iv-show-tree .ivu-tree-arrow {
      /*display: none;*/
    }
    .iv-col {
      position: relative;
      padding: 0 $two-double;
      &:first-child:after {
        position: absolute;
        content: '';
        right: 0;
        bottom: -$two-double;
        top: -$two-double;
        width: 1px;
        background-color: $iv-border-color;
      }
    }
    .iv-title {
      margin-bottom: $two-double;
    }
    .iv-search {
      margin-bottom: $two-double;
    }
  }
  /deep/ .iv-icon-spread {
    display: none !important;
  }
  /deep/ .ivu-tree-empty {
    margin-top: 8px;
  }
</style>
