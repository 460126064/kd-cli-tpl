<!--管理用户管理-->
<template>
  <div
    :class="treeIcon ? 'iv-treeicon-wrapper' : ''"
    class="iv-pos-r iv-selecttree-wrapper">
    <Select
      v-if="!readonly"
      v-model="selectData"
      :clearable="true"
      v-on="$listeners"
      v-bind="$attrs"
      :multiple="multiple"
      filterable>
      <Option
        v-for="(item, $index) in optionList"
        :key="$index"
        :value="item[optionMap.value]">{{item[optionMap.label]}}</Option>
    </Select>
    <Input  readonly v-model="value" v-else/>
    <IconFont
      @click="onShowTree"
      :class="treeIcon ? 'iv-tree-icon' : ''"
      class="iv-tree-check iv-pointer iv-hover-color"
      type="institute"></IconFont>
    <Icon
      v-if="clearable"
      @click="onClearAll"
      class="iv-tree-check-close"
      type="ios-close"></Icon>
    <component
      :is="modal"
      closeText="确定"
      :title="props.title || '所属机构树'"
      @on-ok="onOK"
      @on-cancel="onCancel"
      v-model="showOrganModal">
      <template #modal-content v-if="modal === 'BigModal'">
        <Expand
          v-if="typeof props.render === 'function'"
          :render="props.render"/>
        <FormLayout
          v-else
          class="iv-tree-wrapper">
          <Tree
            show-checkbox
            ref="Tree"
            :data="list"></Tree>
        </FormLayout>
      </template>
      <template #default v-else>
        <Expand
          v-if="typeof props.render === 'function'"
          :render="props.render"/>
        <FormLayout
          v-else
          class="iv-tree-wrapper">
          <IconTree
            ref="Tree"
            v-on="$listeners"
            v-bind="$attrs"
            :data="list"></IconTree>
        </FormLayout>
      </template>
    </component>
  </div>
</template>
<script>
import Modal from '@/components/modal'
import BigModal from '@/components/big-modal'
import IconFont from '@/components/iconfont'
import Expand from 'components/expand'
import IconTree from '@/components/icon-tree'

let optionList = []
export default {
  props: {
    value: {
      type: [String, Array],
      default () {
        return []
      }
    },
    clearable: {
      type: Boolean,
      default: false
    },
    treeUrl: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    optionData: {
      type: Array,
      default () {
        return [{
          label: '业务部',
          value: '1'
        }, {
          label: '研发部',
          value: '2'
        }, {
          label: '业务部',
          value: '3'
        }, {
          label: '研发小组',
          value: '4'
        }]
      }
    },
    optionMap: {
      type: Object,
      default () {
        return {
          value: 'value',
          label: 'label'
        }
      }
    },
    treeData: {
      type: Array,
      default () {
        return [{
          title: '世纪金证公司',
          id: 'id',
          children: [{
            title: '研发部',
            id: '1-1',
            children: [{
              title: '研发小组',
              id: '1-1-1'
            }]
          }, {
            title: '业务部',
            id: '1-2',
            children: [{
              title: '业务小组',
              id: '1-1-2'
            }]
          }]
        }]
      }
    },
    props: {
      type: Object,
      default () {
        return {}
      }
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      modal: this.props.modal || 'Modal',
      showOrganModal: false,
      selectData: this.value,
      treeIcon: false,
      list: this.treeData,
      optionList: this.optionData
    }
  },
  components: {
    Modal,
    BigModal,
    IconFont,
    Expand,
    IconTree
  },
  created () {
    this.getTreeData()
    //生产用
    // this.optionList = !this.optionList.length ? optionList : this.optionList
    //开发阶段
    this.optionList = optionList
  },
  watch: {
    selectData (newVal) {
      this.treeIcon = !!newVal.length
      //触发外部事件
      this.$nextTick(() => {
        this.$emit('on-change', newVal)
      })
    },
    treeData (newVal) {
      this.list = newVal
    },
    optionData (newVal) {
      this.optionList = newVal
    }
  },
  methods: {
    getTreeData () {
      let modal = {}
      this.$ajax({
        url: this.treeUrl,
        method: 'GET',
        data: modal
      }).then(({data}) => {
        data.data[0] && (data.data[0].expand = true)
        this.list = data.data
      })
    },
    onShowTree () {
      if (this.disabled) return
      this.showOrganModal = true
    },
    onClearAll () {
      this.selectData = []
    },
    onCancel () {
      this.showOrganModal = false
    },
    onOK () {
      if (this.$refs.Tree) {
        let data = this.$refs.Tree.getCheckedNodes(), ids = []
        //过滤children
        optionList = this.optionList = data.map(item => {
          console.log(item, '<<<<')
          ids.push(item.id)
          return {
            label: item.title,
            value: item.id
          }
        })
        this.selectData = ids
      }
      this.$emit('on-ok', this.$refs.Tree.getCheckedNodes())
      this.showOrganModal = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .iv-tree-check {
    position: absolute;
    top: 5px;
    right: 22px;
  }
  .iv-treeicon-wrapper {
    &:hover .iv-tree-check-close {
      display: block;
    }
  }
  .iv-tree-check-close {
    position: absolute;
    right: 46px;
    top: 8px;
    font-size: 16px;
    display: none;
    color: #80848f;
  }
  .iv-tree-wrapper {
    min-height: 200px;
    padding: 0 16px;
  }
  .iv-selecttree-wrapper {
    /deep/ .ivu-select-selection {
      height: 34px;
      overflow: hidden;
      padding-right: 60px;
    }
  }
</style>
