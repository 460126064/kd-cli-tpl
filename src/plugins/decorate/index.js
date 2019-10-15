import {trigger} from '@/utils'
import { Table } from 'view-design'
//父类
function Decorate () {
  let decorateList = {
    console () {
      let g = window
      let logMaps = ['log', 'warn', 'error']
      g.console = g.console || {}
      logMaps.forEach(item => {
        if (!g.console[item]) g.console[item] = () => {}
      })
    }
  }
  return {
    add (namespace, fn) {
      if (decorateList[namespace]) {
        console.warn(`${namespace} 已存在`)
        return
      }
      decorateList[namespace] = fn
    },
    exec () {
      for (let i in decorateList) {
        decorateList[i] && decorateList[i].apply(this, arguments)
      }
    }
  }
}
let decorate = Decorate()
//兼容IE9下tabs animate默认值
decorate.add('iview-tabs', (Vue) => {
  let UA = window.navigator.userAgent.toLowerCase()
  let isIE9 = UA && UA.indexOf('msie 9.0') > 0
  if (isIE9) Vue.options.components.Tabs.options.props.animated.default = false
})
//装饰Input组件trim
decorate.add('iview-input', (Vue) => {
  const options = Vue.options.components.Input.options
  const mounted = options.mounted || []
  // options.props.size.default = 'small'
  mounted.push(function () {
    let input = this.$el.querySelector(this.type === 'textarea' ? 'textarea' : 'input')
    input.addEventListener('compositionstart', function (e) {
      e = e || window.event
      e.target.composing = true
    })
    input.addEventListener('compositionend', function (e) {
      e = e || window.event
      if (!e.target.composing) return
      e.target.composing = false
      trigger(e.target, 'input')
    })
  })
})
//兼容select在overflow情况下无法完全展示
decorate.add('iview-datapicker', (Vue) => {
  // let vm
  // const inserted = options.directives.TransferDom.inserted
  const options = Vue.options.components.DatePicker.options
  options.created = options.created || []
  options.props.transfer.default = true
  options.props.editable.default = false
  options.props.uitClass = {
    type: String,
    default: ''
  }
  // uit测试类名埋点暂时忽略
  // options.created.push(function () {
  //   vm = this
  // })
  // options.directives.TransferDom.inserted = function (elm, dir, vnode) {
  //   inserted.apply(this, arguments)
  //   let classList = [...elm.classList]
  //   if (classList.every(item => item.indexOf('uit-') === -1) && vm.uitClass) {
  //     elm.children[0] && elm.children[0].classList.add(vm.uitClass)
  //   }
  // }
})
//兼容下拉框在overflow情况下无法完全展示
decorate.add('iview-select', (Vue) => {
  /*eslint-disable*/
  let options = Vue.options.components.Select.options
  let dropdownCls = options.computed.dropdownCls
  options.props.transfer.default = true
  // options.props.size.default = 'small'
  options.props.uitClass = {
    type: String,
    default: ''
  }
  options.computed.dropdownCls = function () {
    let res = dropdownCls.apply(this, arguments)
    return {
      ...res,
      [this.uitClass]: true
    }
  }
})
//button大小调整
decorate.add('iview-button', (Vue) => {
  /*eslint-disable*/
  let options = Vue.options.components.Button.options
  // options.props.size.default = 'small'
})
//table大小调整
decorate.add('iview-table', (Vue) => {
  Vue.component('Table', Table)
  /*eslint-disable*/
  let options = Vue.options.components.Table.options
  const mounted = options.mounted || []
  mounted.push(function () {
    const ALIGN = this.$store.getters.tableHeadAlign
    this.$el.parentNode.className += ` iv-table-head-text-${ALIGN}`
  })
  const getRandomStr = function (len = 32) {
    const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    const maxPos = $chars.length
    let str = ''
    for (let i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return str
  }
  //修复动态表头，死循环问题
  options.methods.makeColumnsId = function (columns) {
    let list = columns.map(item => {
      if ('children' in item) this.makeColumnsId(item.children)
      item.__id = getRandomStr(6)
      return item
    })
    return list
  }
  // options.props.size.default = 'small'
})
//数字输入框大小调整
decorate.add('iview-inputNumber', (Vue) => {
  /*eslint-disable*/
  let options = Vue.options.components.InputNumber.options
  // options.props.size.default = 'small'
})
//兼容dropdown在overflow情况下无法完全展示
decorate.add('iview-dropdown', (Vue) => {
  /*eslint-disable*/
  let options = Vue.options.components.Dropdown.options
  options.props.transfer.default = true
})
//tabs组件埋点装饰
decorate.add('iview-tab-pane', (Vue) => {
  let tabPaneOptions = Vue.options.components.TabPane.options
  let tabsOptions = Vue.options.components.Tabs.options
  let tabsMounted = tabsOptions.mounted || []
  let tabCls = tabsOptions.methods.tabCls
  tabPaneOptions.props.uitClass = {
    type: String,
    default: ''
  }
  //使用装饰类
  tabsOptions.methods.tabCls = function (item) {
    let res = tabCls.apply(this, arguments)
    let current = this.$children.find(child => child.label === item.label)
    return [
      ...res,
      current.uitClass || ''
    ]
  }
  tabsMounted.push(function () {
    console.log(this.navList, 999)
  })
})
//兼容树形菜单在点击第二次时候是取消
decorate.add('iview-tree', (Vue) => {
  let options = Vue.options.components.Tree.options
  function mixin () {
    if (this.flatState && this.flatState[0]) {
      this.$set(this.flatState[0].node, 'expand', true)
      this.$set(this.flatState[0].node, 'selected', true)
      this.$emit('on-select-change', this.getSelectedNodes())
      this.firstIgnore = false
    }
  }
  //修改handleSelect方法
  options.methods.handleSelect = function (nodeKey) {
    const node = this.flatState[nodeKey].node
    if (!this.multiple) {
      const currentSelectedKey = this.flatState.findIndex(obj => obj.node.selected)
      if (currentSelectedKey >= 0 && currentSelectedKey !== nodeKey) this.$set(this.flatState[currentSelectedKey].node, 'selected', false)
    }
    !node.selected && this.$set(node, 'selected', !node.selected)
    this.$set(node, 'expand', !node.expand)
    this.$emit('on-select-change', this.getSelectedNodes())
    this.notHandleCheck = false
    this.firstIgnore = false
  }
  //修改handleCheckt方法
  options.methods.handleCheck = function ({ checked, nodeKey }) {
    const node = this.flatState[nodeKey].node
    this.notHandleCheck = false
    this.$set(node, 'checked', checked)
    this.$set(node, 'indeterminate', false)
    this.updateTreeUp(nodeKey)
    this.updateTreeDown(node, {checked, indeterminate: false})
    this.$emit('on-check-change', this.getCheckedNodes(), {
      checked,
      node,
      index: nodeKey
    })
  }
  //混入created
  options.created.push(function () {
    //首次展开忽略，防止重复设置
    this.firstIgnore = this.notHandleCheck = true
    mixin.call(this)
  })
  //混入watch
  // options.watch.flatState = function () {
  //   this.firstIgnore && mixin.call(this, false)
  // }
  let handler = options.watch.data.handler
  options.watch.data = function () {
    handler.apply(this, arguments)
    this.firstIgnore = this.notHandleCheck
    this.$nextTick(() => {
      this.notHandleCheck = true
    })
  }
})
export default {
  install: function (Vue, options) {
    decorate.exec.apply(this, arguments)
  }
}
