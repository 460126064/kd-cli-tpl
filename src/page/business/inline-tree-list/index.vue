/**
* @file 分类树列表脚手架模板
* @author LZK
* @overview 视图查看
*/
<template>
  <TreeListLayout
    :class="modalLayoutClass"
    :contentPadding="$attrs.contentPadding"
    :showTree="showTree"
    :autoHeight="$attrs.autoHeight">
    <div slot="layout-tree">
      <slot :data="dataTree" name="layout-tree">
        <div class="iv-tree-search-wrapper">
          <Select
            class="iv-filterable-select iv-fullwidth"
            filterable
            remote
            clearable
            :placeholder="treePlaceHolder"
            @on-clear="onSelectClear"
            @on-change="onSearchSelected"
            :remote-method="searchTreeList">
            <Option v-for="(option, index) in treeResultList" :value="option.id" :key="index">{{option.title}}</Option>
          </Select>
          <IconFont
            @click="changeTreeWidth"
            class="iv-icon-spread iv-fs-18 iv-pointer iv-hover-color"
            :type="treeCollapse ? 'outdent' : 'indent'"></IconFont>
        </div>
        <Tree
          ref="Tree"
          :data="dataTree"
          :render="renderContent"
          :show-checkbox="$attrs.showCheckbox"
          @on-check-change="onCheckChange"
          @on-select-change="onSelectChange">
        </Tree>
      </slot>
    </div>
    <div slot="layout-content">
      <!-- 头部编辑组件 -->
      <EditList
        ref="Edit"
        v-if="!isEmptyObj(editConfig)"
        :headerUrl="$attrs.headerUrl"
        :headerFistEdit="$attrs.headerFistEdit"
        :config="editConfig"/>
      <!-- 自定义头部区域 -->
      <slot name="custom"></slot>
      <!-- 统一搜索组件 -->
      <SearchLayout
        ref="Search"
        @on-search="onSearch"
        v-if="searchList.length"
        :immediate="$attrs.immediate"
        :list="searchList"/>
      <!-- 统一操作组件 -->
      <OperationLayout
        ref="Operation"
        v-if="operationList.length"
        :list="operationList"/>
      <!-- 弹窗提示 -->
      <Alert v-if="isHasSlot">
        <slot name="alert"></slot>
      </Alert>
      <!-- 表格组件-->
      <Table
        border
        ref="Table"
        v-bind="$attrs"
        :url="listUrl"
        :columns="columns"
        v-on="$listeners"
        :disabledDrag="$attrs.disabledDrag"
        :showDelete="$attrs.showDelete"
        :showEdit="$attrs.showEdit"
        :showSave="$attrs.showSave"
        :showSort="$attrs.showSort"
        :showSelect="$attrs.showSelect"
        :show-header="$attrs.showHeader"
        :pageSize="$attrs.pageSize"
        :listData="listData"
        :fixedSelection="$attrs.fixedSelection"
        :fixedSort="$attrs.fixedSort"
        :no-data-text="tips.list && tips.list.noDataText || '暂无数据'"
        @on-select-all="onSelectAll"
        @on-select="onSelect"
        @on-select-cancel="onSelectCancel"
        @on-selection-change="tableSelectChange"
        @on-list="onList"/>
    </div>
    <!-- 删除确认框 -->
    <DeleteModal
      v-model="showDeleteModal"
      @on-ok="confirmDelete"/>
    <slot></slot>
  </TreeListLayout>
</template>
<script>
import collapseTreeMixin from '@/mixins/collapse-tree'
/*
     * @description 头部编辑组件
     */
import EditList from 'components/edit-list'
/*
     * @description 操作布局组件
     */
import OperationLayout from '@/components/operation-layout'
/*
     * @description 翻页组件
     */
import Page from '@/components/page'
/*
     * @description 引入搜索布局
     */
import SearchLayout from '@/components/search-layout'
import Alert from '@/components/alert'
/*
     * @description 引入TreeListLayout组件
     */
import TreeListLayout from '@/page/business/treelist-layout'
/*
     * @description 引入删除模态框组件
     */
import DeleteModal from '@/page/business/delete-modal'
import Table from '@/page/business/drag-table-inline'
import validateInline from '@/mixins/validate-inline'
import IconFont from '@/components/iconfont'
/*
     * @description 导出组件默认接口
     */
export default {
  name: 'InlineTreeList',
  mixins: [validateInline, collapseTreeMixin],
  props: {
    showTree: {
      type: Boolean,
      default: true
    },
    editConfig: {
      type: Object,
      default () {
        return {}
      }
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
    },
    rules: {
      type: Object,
      default () {
        return {}
      }
    },
    renderContent: {
      type: Function
    },
    treePlaceHolder: {
      type: String,
      default: '请搜索'
    }
  },
  /*
       * @description 双向绑定定义区域，所有需要双向绑定的值都必须定义到data中
       */
  data () {
    return {
      //树形菜单数据
      dataTree: [],
      isHasSlot: false,
      //列表菜单数据
      dataTable: [],
      //是否展示删除模态框
      showDeleteModal: false,
      treeResultList: [].pop(),
      parentsResult: []
    }
  },
  /*
      * @description 为子组件提供服务，此方法只适用于子组件
      */
  provide () {
    return {
      deleteItem: this.deleteItem,
      deleteChange: this.deleteChange,
      addChange: this.addChange,
      removeAdd: this.removeAdd,
      saveItem: this.saveItem
    }
  },
  inject: {
    assertDelete: {
      default () {
        return function () {
          /*eslint-disable*/
            return new Promise(function () {
            })
          }
        }
      },
      changeSave: {
        default() {
          return function () {
            /*eslint-disable*/
            return new Promise(function () {
            })
          }
        }
      },
      changeCancel: {
        default() {
          return function () {
            /*eslint-disable*/
            return new Promise(function () {
            })
          }
        }
      },
      changeAdd: {
        default() {
          return function () {
            /*eslint-disable*/
            return new Promise(function () {
            })
          }
        }
      },
      formatTreeHandler: {
        default() {
          return function (data) {
            return Promise.resolve(data)
          }
        }
      }
    },
    /*
     * @description created生命周期为最近可以获取到data数据的钩子，所有涉及到渲染，
     * 但是不涉及双向绑定的值可以定义在这个生命周期中
     */
    created() {
      //请求参数
      this.params = {
        //树形分类ID
        ...(this.showTree ? {classifyId: ''} : {})
      }
      // 获取树形列表
      this.showTree && this.getTreeList()
      //判断是否存在alert插槽
      this.$slots.alert && (this.isHasSlot = true)
      //初始化table多选项队列
      this.activeTableSelect = []
      this.modalLayoutClass = ''
      try {
        let name = this.getComponentName(this.$parent.$vnode.componentOptions)
        if (name === 'Modal') {
          this.modalLayoutClass = 'iv-modal-layout'
          return
        }
      } catch (err) {
        console.warn(err)
      }
    },
    mounted() {
      !this.showTree && this.forceRender()
    },
    //缓存组件重新渲染生命周期钩子
    activated() {
    },
    components: {
      TreeListLayout,
      SearchLayout,
      OperationLayout,
      EditList,
      Page,
      DeleteModal,
      Table,
      Alert,
      IconFont
    },
    methods: {
      isEmptyObj(obj) {
        return !Object.keys(obj).length
      },
      /*
      * @description 获取树形菜单
      */
      getTreeList(openNode, key) {
        if (!this.treeUrl) return
        this.$ajax({
          url: `${this.treeUrl}`,
          method: 'GET',
          data: this.treeData
        }).then(({data}) => {
          this.formatTreeHandler(data).then((data) => {
            //如果有需要展开的节点则展开
            if (openNode && openNode.id !== data.data[0].id) {
              let node = this.getOpenTreeNode(data.data[0].children, openNode, key)
              node && (node.expand = true)
            } else {
              // 默认展开第一级
              data.data[0] && (data.data[0].expand = true)
            }
            //双向绑定，将树形菜单赋值给绑定值
            this.dataTree = data.data
            //初始化分类ID和默认选中第一个
            this.onSelectChange([data.data[0]])
          })
        })
      },
      getOpenTreeNode(treeNode, openNode, key) {
        treeNode.expand = true
        let i = 0
        let needOpen = treeNode.find(item => {
          return item[key] === openNode[key]
        })
        if (!needOpen && treeNode[i].children.length) {
          needOpen = this.getOpenTreeNode(treeNode[i].children, openNode, key)
          i++
        }
        if (needOpen) {
          return needOpen
        }
      },
      addLine(addItem = {isEdit: true, _isAdd: true}) {
        this.dataTable.unshift(addItem)
      },
      onList(list, data) {
        this.dataTable = list
        //暴露源数据
        this.$emit('on-list', list, data)
      },
      // 树复选框点击事件
      onCheckChange(item) {
        this.$emit('on-check-change', ...arguments)
      },
      getCheckedNodes() {
        return this.$refs.Tree.getCheckedNodes()
      },
      // 强制刷新,供外部使用
      forceRender() {
        this.$methods('Table', 'setParams', this.params)
      },
      /*
      * @description 根据type来映射是否是重置
      * @params type {String} 重置时候为reset
      */
      onSearch(params) {
        this.$methods('Table', 'setParams', Object.assign(this.params, params))
      },
      /*
      * @description 表格选中事件
      */
      tableSelectChange(list) {
        //重置选中项
        this.activeTableSelect = list
        this.$emit('on-selection-change', list)
      },
      extend(sup, sub) {
        sup.forEach((item, index) => {
          if (item.isEdit || sub[index].isEdit) {
            Object.assign(item, sub[index])
          }
        })
      },
      /*
      * @description 树形菜单点击事件
      */
      onSelectChange(items) {
        this.$methods('Table', 'setParams', Object.assign({}, this.params, {
          [this.treeMap.id]: this.dataTree[0] ? this.dataTree[0][this.treeMap.value || 'id'] : ''
        }))
        this.$nextTick(() => {
          this.$refs.Edit && this.$methods('Edit', 'setNode', items[0])
        })
        this.$emit('on-select-change', items)
      },
      /*
      * @description 表格取消选中某一项时触发
      */
      onSelectCancel(list, row) {
        this.$emit('on-select-cancel', list, row)
      },
      //表格选中某一项触发
      onSelect(list, row) {
        this.$emit('on-select', list, row)
      },
      //表格全选
      onSelectAll() {
        this.$emit('on-select-all', ...arguments)
      },
      onEditList() {
        this.extend(this.dataTable, this.$refs.Table.$refs.Table.rebuildData)
        return this.dataTable.filter(item => item.isEdit)
      },
      /*
      * @description 统一操作删除触发
      */
      deleteChange() {
        if (!this.activeTableSelect.length) {
          this.$Message.error(`当前没有选中项`)
          return
        }
        this.showDeleteModal = true
      },
      addChange(item) {
        let newList = {
          isEdit: true,
          _isAdd: true
        }
        this.extend(this.dataTable, this.$refs.Table.$refs.Table.rebuildData)
        this.dataTable.unshift(newList)
        this.$nextTick(() => {
          this.changeAdd(item, this.dataTable.filter(item => item._isAdd))
        })
      },
      removeAdd(index) {
        let item = this.dataTable[index]
        if (item._isAdd) {
          this.dataTable.splice(index, 1)
          this.$refs.Table.$refs.Table.rebuildData.splice(index, 1)
        }
        //数据初始化
        this.extend(this.dataTable, this.$refs.Table.$refs.Table.rebuildData)
        this.changeCancel(index, item)
      },
      saveItem(item) {
        //表单校验
        return this.validateInline(item).then((res) => {
          return this.changeSave(item)
        }).then((data) => {
          return this.sendRequest(item._isAdd ? 'POST' : 'PUT', data).then((res) => {
            if (res.data.code !== '5000') {
              item._isAdd && this.forceRender()
              this.$emit('on-save-success', res.data.data, item._isAdd)
            }
            return Promise.resolve(res)
          })
        }).catch((errers) => {
          console.error(errers)
          return Promise.reject()
        })
      },
      confirmDelete() {
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
      sendRequest(method, data = {}) {
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
      deleteItem(data) {
        let sendParams = undefined
        data = Array.isArray(data) ? data : [data]
        return this.assertDelete(data)
          .then((params) => {
            sendParams = params
            return this.$ajax({
              url: `${this.listDeleteUrl || this.listUrl}`,
              method: 'DELETE',
              data: params
            })
          })
          .then(({data}) => {
            if (data.code !== '5000') {
              this.$emit('on-delete-success', sendParams)
              this.forceRender()
            }
            return data
          })
      },
      /* 搜索框清空事件 */
      onSelectClear() {
        this.treeResultList = []
      },
      /* 搜索结果点击事件 */
      onSearchSelected(id) {
        const item = this.treeResultList.find(item => item.id === id)
        if (item) {
          // 展开节点树
          // console.log(this.parentsResult)
          // if (item.expand === void 0) {
          //   // let obj = this.$refs.treeList.dataTree
          //   item.parentPath.split('.').forEach(path => {
          //     obj = obj[path]
          //   })
          //   obj.expand = true
          // } else {
          //   item.expand = true
          // }
          this.parentsResult.forEach((path) => {
            this.dataTree.forEach(() => {

            })
          })
          // 触发更新
          this.onSelectChange([item])
          // this.$refs.treeList.forceRender()
        }
      },
      /* 搜索事件 */
      searchTreeList(query) {
        this.treeResultList = []
        this.cacheLen = 0
        this.searchCode(this.dataTree, query)
      },
      /* 递归查询搜索结果 */
      searchCode(arr, code) {
        arr.forEach((item, key) => {
          if (item.title.indexOf(code) > -1) {
            // 下拉
            this.curID = item.nodeKey
            this.treeResultList.push(item)
            return
          }
          item.expand = false
          item.children && this.searchCode(item.children, code)

          if (this.cacheLen !== this.treeResultList.length) {
            this.cacheLen++
            (this.searchResultMap[this.curID] || (this.searchResultMap[this.curID] = [])).push(item)
          }
        })
      },
      setListUrl(url) {
        this.$methods('Table', 'setUrl', url)
      },
      setColumns(columns) {
        this.$methods('Table', 'setColumns', columns)
      },
      setOperationList(list) {
        this.$methods('Operation', 'setList', list)
      },
      setEditConfig(config) {
        this.$methods('Edit', 'setConfig', config)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .iv-modal-layout {
    margin: -36px;
  }
</style>
<style lang="scss" scoped>
  .iv-tree-search-wrapper {
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

    /deep/ .iv-tree-selected {
      background: #d5e8fc;
      border-radius: 2px;
    }

    /deep/ .iv-icon {
      position: relative;
      top: 2px;
      margin-right: 4px;
    }
  }
</style>
