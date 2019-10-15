/**
* @file 分类树列表脚手架模板
* @author LZK
* @overview 视图查看
*/
<template>
  <div>
    <TreeListLayout
      :class="modalLayoutClass"
      :contentPadding="$attrs.contentPadding"
      :showTree="showTree"
      :autoHeight="$attrs.autoHeight">
      <div slot="layout-tree">
        <Tree
          ref="Tree"
          :data="dataTree"
          :show-checkbox="$attrs.showCheckbox"
          @on-check-change="onCheckChange"
          @on-select-change="onSelectChange">
        </Tree>
      </div>
      <div slot="layout-content">
        <!-- 统一搜索组件 -->
        <SearchLayout
          v-if="getSearch().length"
          @on-search="onSearch"
          :immediate="$attrs.immediate"
          :list="getSearch()" />
        <!-- 统一操作组件 -->
        <OperationLayout
          v-if="getOperation().length"
          :list="getOperation()"/>
        <!-- 弹窗提示 -->
        <Alert v-if="isHasSlot">
          <slot name="alert"></slot>
        </Alert>
        <!-- 表格组件-->
        <Table
          border
          :params="params"
          :url="listUrl"
          :columns="getCol()"
          :disabledDrag="$attrs.disabledDrag"
          :cacheColumns="false"
          :showDelete="$attrs.showDelete"
          :showEdit="$attrs.showEdit"
          :show-header="$attrs.showHeader"
          :pageSize="$attrs.pageSize"
          :showPage="$attrs.showPage"
          :showSort="$attrs.showSort"
          :listData="listData"
          v-bind="$attrs"
          v-on="$listeners"
          @on-select-all="onSelectAll"
          @on-select="onSelect"
          @on-select-cancel="onSelectCancel"
          @on-selection-change="tableSelectChange"
          @on-list="onList"/>
      </div>
      <!-- 删除确认框 -->
      <DeleteModal
        v-model="showDeleteModal"
        @on-ok="confirmDelete" />
      <slot></slot>
    </TreeListLayout>
  </div>
</template>
<script>
// import {timeFormat} from '@/utils'
/*
   * @description 操作布局组件
   */
import OperationLayout from '@/components/operation-layout'
/*
   * @description 翻页组件
   */
import Page from '@/components/page'
/*
   * @description 引入表单校验混合
   */
import mixinValidate from '@/mixins/validate'
/*
   * @description 引入搜索布局
   */
import SearchLayout from '@/components/search-layout'
/*
   * @description 引入TreeListLayout组件
   */
import TreeListLayout from '@/page/business/treelist-layout'
import IconFont from '@/components/iconfont'
/*
   * @description 引入删除模态框组件
   */
import DeleteModal from '@/page/business/delete-modal'
import Alert from '@/components/alert'
import Table from '@/page/business/drag-table'
import tableParse from './table-parse'
import searchParse from './search-parse'
import operatorParse from './operator-parse'
/*
   * @description 导出组件默认接口
   */
export default {
  name: 'TreeList',
  props: {
    showTree: {
      type: Boolean,
      default: true
    },
    searchList: {
      type: Array,
      default () {
        return []
      }
    },
    operationList: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    configUrl: {
      type: String,
      default: ''
    },
    configHeader: {
      type: Object,
      default () {
        return {}
      }
    },
    // 树接口
    treeUrl: {
      type: String,
      default: ''
    },
    // 列表接口
    listUrl: {
      type: String,
      default: ''
    },
    //列表删除接口
    listDeleteUrl: {
      type: String,
      default: ''
    },
    treeData: {
      type: Object,
      default () {
        return {}
      }
    },
    treeMap: {
      type: Object,
      default () {
        return {
          id: 'id',
          value: 'id'
        }
      }
    },
    listData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  //混入表单校验
  mixins: [mixinValidate, tableParse, searchParse, operatorParse],
  /*
     * @description 双向绑定定义区域，所有需要双向绑定的值都必须定义到data中
     */
  data () {
    return {
      //树形菜单数据
      dataTree: [],
      //列表菜单数据
      dataTable: [],
      //是否展示删除模态框
      showDeleteModal: false,
      isHasSlot: false,
      remoteColumns: [],
      remoteSearchList: [],
      remoteOperationList: [],
      //请求参数
      params: {
        //树形分类ID
        ...(this.showTree ? {classifyId: ''} : {})
      }
    }
  },
  /*
    * @description 为子组件提供服务，此方法只适用于子组件
    */
  provide () {
    return {
      deleteItem: this.deleteItem,
      deleteChange: this.deleteChange
    }
  },
  inject: {
    assertDelete: {
      default () {
        return function () {
          /*eslint-disable*/
            return new Promise(function () {})
          }
        }
      }
    },
    /*
     * @description created生命周期为最近可以获取到data数据的钩子，所有涉及到渲染，
     * 但是不涉及双向绑定的值可以定义在这个生命周期中
     */
    created () {
      // 获取树形列表
      this.showTree && this.getTreeList()
      //判断是否存在alert插槽
      this.$slots.alert && (this.isHasSlot = true)
      //是否为新结构配置
      this.configUrl && this.getConfig()
      //初始化table多选项队列
      this.activeTableSelect = []
      this.modalLayoutClass = ''
      try {
        let name = this.getComponentName(this.$parent.$vnode.componentOptions)
        if (name === 'Modal') {
          this.modalLayoutClass = 'iv-modal-layout'
          return
        }
      } catch(err) {
        console.warn(err)
      }
    },
    mounted () {
      !this.searchList.length && this.forceRender()
    },
    //缓存组件重新渲染生命周期钩子
    activated () {},
    components: {
      TreeListLayout,
      SearchLayout,
      OperationLayout,
      Page,
      DeleteModal,
      Table,
      Alert,
      IconFont
    },
    methods: {
      /*
      * @description 获取树形菜单
      */
      getTreeList () {
        this.$ajax({
          url: `${this.treeUrl}`,
          method: 'GET',
          data: this.treeData
        }).then(({data}) => {
          // 默认展开第一级
          data.data[0] && (data.data[0].expand = true)
          //双向绑定，将树形菜单赋值给绑定值
          this.dataTree = data.data.resultList.map(item => {
            return {
              title: item.organizationName,
              id: item.organizationId
            }
          })
          //初始化分类ID
          this.params = Object.assign({}, this.params, {
            [this.treeMap.id]: this.dataTree[0] ? this.dataTree[0][this.treeMap.value || 'id'] : ''
          })
        })
      },
      //获取组件name
      getComponentName (opts) {
        return opts && (opts.Ctor.options.name || opts.tag)
      },
      onList (list, data) {
        this.dataTable = list
        //暴露源数据
        this.$emit('on-list', list, data)
      },
      // 树复选框点击事件
      onCheckChange () {
        this.$emit('on-check-change', ...arguments)
      },
      getCheckedNodes () {
        return this.$refs.Tree.getCheckedNodes()
      },
      getConfig () {
        this.$ajax({
          url: this.configUrl,
          method: 'GET',
          headers: this.configHeader
        }).then(({data}) => {
          let { list, searchList, operatorList } = data.data
          this.getColumns(list)
          this.getSearchList(searchList)
          this.getOperationList(operatorList)
        })
      },
      // 强制刷新,供外部使用
      forceRender () {
        this.params = Object.assign({}, this.operatorList)
      },
      /*
      * @description 根据type来映射是否是重置
      * @params type {String} 重置时候为reset
      */
      onSearch (params) {
        this.params = Object.assign({}, this.params, params)
      },
      /*
      * @description 表格选中事件
      */
      tableSelectChange (list) {
        //重置选中项
        this.activeTableSelect = list
        this.$emit('on-selection-change', list)
      },
      /*
      * @description 树形菜单点击事件
      */
      onSelectChange (items) {
        this.params = Object.assign({}, this.params, {
          [this.treeMap.id]: items[0] ? items[0][this.treeMap.value || 'id'] : ''
        })
        this.$emit('on-select-change', items)
      },
      /*
      * @description 表格取消选中某一项时触发
      */
      onSelectCancel (list, row) {
        this.$emit('on-select-cancel', list, row)
      },
      //表格选中某一项触发
      onSelect (list, row) {
        this.$emit('on-select', list, row)
      },
      //表格全选
      onSelectAll () {
        this.$emit('on-select-all', ...arguments)
      },
      /*
      * @description 统一操作删除触发
      */
      deleteChange () {
        if (!this.activeTableSelect.length) {
          this.$Message.error(`当前没有选中项`)
          return
        }
        this.showDeleteModal = true
      },
      /*
      * @description 确认批量删除
      */
      confirmDelete () {
        //断言是否可以删除
        this.assertDelete(this.activeTableSelect)
          .then((data) => {
            return this.sendRequest('DELETE', data)
          })
          .then(() => {
            this.showDeleteModal = false
            this.forceRender()
            this.activeTableSelect.length = 0
          })
          .catch((errers) => {
            console.error(errers)
          })
      },
      sendRequest (method, data = {}) {
        return this.$ajax({
          url: `${this.listDeleteUrl || this.listUrl}`,
          method: method,
          data: data
        })
      },
      /*
      * @description 改变页面展示页码数
      * @params {Object} 删除数据元数据
      * 注意：此方法用于provide，供子组件使用，禁止本组件使用
      */
      deleteItem (data) {
        data = Array.isArray(data) ? data : [data]
        return this.assertDelete(data)
          .then((params) => {
            return this.$ajax({
              url: `${this.listDeleteUrl || this.listUrl}`,
              method: 'DELETE',
              data: params
            })
          })
          .then(({data}) => {
            this.forceRender()
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .iv-modal-layout {
    margin: -36px;
  }
</style>
