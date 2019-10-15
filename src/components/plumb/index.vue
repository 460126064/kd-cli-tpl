<template>
  <div
    :class="preview ? 'iv-preview-wrapper' : ''"
    class='iv-mainprocess-wrapper'>
    <div v-if="!preview" class='iv-hd-wrapper' id='iv-hd-wrapper'>
      <div
        v-for="item in moduleList"
        :key="item.id"
        @mousedown='(e) => headMouseDown(e, "head")'
        :id='item.id'
        :data-type='item.type'
        class='iv-hd-item iv-pointer iv-pull-left iv-fs-12'>
        <IconFont :type='item.icon' class='iv-m-r-4'></IconFont>
        <span>{{item.name}}</span>
      </div>
      <div id='iv-zoom' class='iv-hd-item iv-pull-right iv-fs-12'>
        <IconFont
          @click.native='onZoom("Plus")'
          type='plus-square-fill'
          class='iv-hover-color iv-pointer iv-m-r-4'></IconFont>
        <span>{{(zoom * 100).toFixed(0)}}%</span>
        <IconFont
          @click.native='onZoom'
          type='minus-square-fill'
          class='iv-hover-color iv-pointer iv-m-l-4'></IconFont>
      </div>
    </div>
    <div
      @keyup.enter='onkeyUp'
      :class='anchorClass'
      class='iv-bd-wrapper' id='iv-bd-wrapper'>
      <div
        :style='zoomStyle'
        class='iv-zoom'>
        <div
          v-for='(item, $index) in processList'
          :key='item.id'
          :id='item.id'
          :style='item | filterPosition'
          :class='activeIndex === $index ? "iv-main-color iv-main-border-color" : "iv-fc-65"'
          @click='onTaskClick($index)'
          @mousedown='(e) => headMouseDown(e, "body")'
          class='iv-process-item iv-fs-14 iv-pointer iv-hover-color iv-hover-border-color'>
          <IconFont :type='item.icon' class='iv-pull-left'></IconFont>
          <span>{{item.name}}</span>
        </div>
        <!-- 占位元素 -->
        <div id="iv-process-placeholder-item" class="iv-process-placeholder-item"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {jsPlumb, jsPlumbUtil} from 'jsplumb'
import IconFont from '@/components/iconfont'
import 'jsplumb/css/jsplumbtoolkit-defaults.css'
import common from './common'
import Anchor from './anchor'
import ModuleList from './module.conf'
import defaultTask from './init-task'
//初始化拖拽节点宽度
const OVERPLUSWIDTH = 86
const cloneClass = '.katavorio-clone-drag'
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    init: {
      type: Boolean,
      default: true
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      processList: this.initProcessList(),
      zoom: 1,
      activeIndex: 0,
      showAnchor: false
    }
  },
  computed: {
    zoomStyle () {
      return {
        transform: `scale(${this.zoom})`
      }
    },
    anchorClass () {
      return {
        'iv-show-anchor': this.showAnchor
      }
    }
  },
  components: {
    IconFont
  },
  created () {
    this.common = common.call(this)
    this.moduleList = ModuleList.call(this)
    this._uid = Math.max(this.processList.length - 2, 0)
    this.jsPlumb = jsPlumb.getInstance()
    this.initDefaultTask()
    //开始任务连接flag
    this.startTaskFlag = false
  },
  watch: {
    list (newVal) {
      this.processList = newVal
      this._uid = Math.max(newVal.length - 2, 0)
      this.$nextTick(() => {
        this.initBody()
      })
    },
    processList (newVal) {
      this.$emit('on-list-change', newVal, this.activeIndex)
    },
    init () {
      this.processList = this.initProcessList()
      this.$nextTick(() => {
        this.initRender()
      })
    }
  },
  mounted () {
    this.initRender()
  },
  filters: {
    filterPosition ({top, left}) {
      return {
        top: `${top}px`,
        left: `${left}px`
      }
    }
  },
  methods: {
    initRender () {
      this.initHeader()
      this.initBody()
      this.initGlobal()
      //内部点击标识
      this.innerFlag = false
      //修正初始化定位
      this.init && this.initPosition()
    },
    initPosition () {
      let el = document.querySelector('#iv-bd-wrapper')
      let {width} = window.getComputedStyle(el)
      this.processList[0].left = (parseInt(width) - OVERPLUSWIDTH) / 2
      this.processList[this.processList.length - 1].left = (parseInt(width) - OVERPLUSWIDTH) / 2
      this.$forceUpdate()
      this.$nextTick(() => {
        this.repain()
      })
      this.$emit('on-init', this.processList)
    },
    initHeader () {
      this.moduleList.forEach(item => {
        this.initDrag(item.id, 'iv-hd-wrapper')
      })
    },
    initBody () {
      this.processList.forEach(item => {
        !this.preview && this.initDrag(item.id, 'iv-bd-wrapper', false)
        //新增端点
        this.addEndpoint(item)
      })
      //新增连线
      this.processList.forEach(item => {
        this.connect(item)
      })
      //初始化占位
    },
    initDrag (id, parentId, isClone = true) {
      let options = {
        clone: isClone
      }
      this.jsPlumb.draggable(id, {
        containment: parentId,
        ...options
      })
    },
    initGlobal () {
      // jsPlumb.setContainer('app')
      this.jsPlumb.cleanupListeners()
      //连线前边界
      this.jsPlumb.bind('beforeDrop', (args) => {
        if (!this.connectRules(args)) return false
        this.$emit('on-before-drop', args)
        if (args.sourceId === 'Start') (this.startTaskFlag = true)
        return true
      })
      //连线点击事件
      this.jsPlumb.bind('mousedown', (con, e) => {
        this.innerFlag = true
        this.currentCon = con
        this.$emit('on-mousedown', con, e)
      })
      //连线连接事件
      this.jsPlumb.bind('connection', (info, e) => {
        //更新连线状态
        this.updateAnchorConnect(info)
        let sourceIndex = this.getIndex(info.source)
        let targetIndex = this.getIndex(info.target)
        info.sourceuuid = this.processList[sourceIndex].uuid
        info.targetuuid = this.processList[targetIndex].uuid
        this.$emit('on-connection', info, e)
      })
      document.addEventListener('keyup', this.onkeyUp)
      document.addEventListener('click', this.cancelDelete)
      //销毁事件
      this.$on('hook:beforeDestroy', () => {
        document.removeEventListener('keyup', this.onkeyUp)
        document.removeEventListener('click', this.cancelDelete)
      })
    },
    //初始化默认模块配置
    initDefaultTask () {
      this.defaultTask = {}
      this.moduleList.forEach(item => {
        this.defaultTask[item.type] = {
          icon: item.icon,
          tasktype: item.tasktype,
          name: item.name,
          top: 100,
          left: 100,
          ...Anchor()
        }
      })
    },
    initProcessList () {
      let {defaultStart, defaultEnd} = defaultTask.call(this)
      return this.init ? defaultStart.concat(defaultEnd) : this.list
    },
    onkeyUp (e) {
      if (this.preview || e.keyCode !== 46 || e.key.toLocaleLowerCase() !== 'delete') return
      //删除连线
      if (this.currentCon) {
        //更新连线信息
        this.updateConnection()
        this.$emit('on-delete-connection', this.currentCon)
        this.jsPlumb.deleteConnection(this.currentCon)
        this.currentCon = null
        return
      }
      //删除端点
      if (this.currentDownTarget) {
        if (this.currentDownTarget.id === 'Start' || this.currentDownTarget.id === 'End') {
          this.$Message.error('主流程不能删除!')
          return
        }
        let index = this.getIndex(this.currentDownTarget)
        this.$emit('on-delete-point', this.processList[index], this.currentDownTarget)
        this.jsPlumb.remove(this.currentDownTarget)
        this.processList.splice(index, 1)
      }
    },
    onZoom (type) {
      if (type === 'Plus') {
        this.zoom += 0.1
        return
      }
      this.zoom -= 0.1
      this.jsPlumb.setZoom(this.zoom)
    },
    onTaskClick (index) {
      this.activeIndex = index
    },
    connectRules (args) {
      let {sourceId, targetId} = args
      switch (true) {
        case sourceId === 'Start' && targetId === 'End':
          this.$Message && this.$Message.error('主流程不能互连!')
          return
        //相同源禁止连接
        case sourceId === targetId:
          return
        //开始模块不能有入口, 结束模块不能有出口
        case targetId === 'Start' || sourceId === 'End':
          this.$Message.error('开始任务不能有出口')
          return
        case sourceId === 'Start' && this.startTaskFlag:
          this.$Message.error('开始任务只能有一个出口')
          return
        default:
          return true
      }
    },
    //更新连线后锚点状态
    updateAnchorConnect ({source, sourceEndpoint, target, targetEndpoint, connection}) {
      let sourceIndex = this.getIndex(source)
      // let targetIndex = this.getIndex(target)
      let sourceItem = this.processList[sourceIndex]
      // let targetItem = this.processList[targetIndex]
      let sourceuuid = sourceEndpoint._jsPlumb.uuid
      let targetuuid = targetEndpoint._jsPlumb.uuid
      let connectuuid = jsPlumbUtil.uuid()
      //初始化队列
      sourceItem[sourceuuid] = sourceItem[sourceuuid] || []
      //更新队列
      if (sourceItem[sourceuuid].indexOf(targetuuid) === -1) sourceItem[sourceuuid].push(targetuuid)
      //保存连接线的信息
      let item = sourceItem[`${sourceuuid}$${targetuuid}`] = sourceItem[`${sourceuuid}$${targetuuid}`] || {}
      item.id = connection.uuid = item.id || connectuuid
    },
    //更新路由信息
    updateRouterInfo (key, value, connection) {
      let item = this.getRouterInfo(connection)
      item[key] = value
    },
    //更新连线信息
    updateConnection () {
      let sourceIndex = this.getIndex(this.currentCon.source)
      let sourceItem = this.processList[sourceIndex]
      //如果删除的元素为开始模块，更新flag
      if (sourceItem.id === 'Start') (this.startTaskFlag = false)
      for (let key in sourceItem) {
        //确认是路由信息
        let id = sourceItem[key] && sourceItem[key].id
        if (sourceItem.hasOwnProperty(key) && id && id === this.currentCon.uuid) {
          let router = key.split('$')
          //遍历router
          let list = sourceItem[router[0]]
          let index = list.indexOf(router[1])
          list.splice(index, 1)
          delete sourceItem[key]
        }
      }
    },
    //获取路由信息
    getRouterInfo (connection) {
      let sourceIndex = this.getIndex(connection.source)
      let sourceItem = this.processList[sourceIndex]
      for (let k in sourceItem) {
        if (!sourceItem.hasOwnProperty(k)) return
        let item = sourceItem[k]
        if (item && item.id && connection.uuid === item.id) {
          return item
        }
      }
    },
    updateTask (index, key, value) {
      let item = this.processList[index]
      item[key] = value
    },
    getDeafultTask (type) {
      let cleanTask = {}
      return Object.assign(cleanTask, this.defaultTask[type], Anchor())
    },
    headMouseDown (e, origin) {
      let currentTarget = this.currentDownTarget = e.currentTarget
      this.innerFlag = true
      //避免与连线冲突，二者任选其一
      this.currentCon = null
      //预览模式下直接走操作
      if (this.preview) {
        this.dragBodyStop.apply(this, arguments)
        return
      }
      //装饰过，避免进行重复操作
      if (currentTarget.isDecorate) return
      currentTarget.isDecorate = true
      this.decorate(currentTarget._katavorioDrag, origin)
    },
    decorate (dragInstance, origin) {
      let originStop = dragInstance.stop
      let self = this
      dragInstance.stop = function () {
        let dragStop = origin === 'head' ? self.dragStop : self.dragBodyStop
        dragStop.apply(self, arguments)
        return originStop.apply(this, arguments)
      }
    },
    getPosition (el = '') {
      if (el.nodeType !== 1 || !el) {
        el = document.querySelector(cloneClass)
      }
      let parentRect = document.getElementById('iv-bd-wrapper').getBoundingClientRect()
      let target = window.getComputedStyle(el)
      let x = parseInt(target.left) - parentRect.x
      let y = parseInt(target.top) - (parentRect.y + (document.body.scrollTop || document.documentElement.scrollTop))
      return {x, y}
    },
    getIndex (el) {
      let parent = el.parentElement
      return [...parent.children].findIndex(item => {
        return item === el
      })
    },
    dragStop () {
      let type = this.currentDownTarget.dataset.type
      let task = this.getDeafultTask(type)
      let {x, y} = this.getPosition()
      if (x < 0 || y < 0) return
      Object.assign(task, {
        id: `${type}-${++this._uid}`,
        left: x,
        top: y,
        uuid: jsPlumbUtil.uuid()
      })
      this.processList.splice(1, 0, task)
      this.$emit('on-drag-stop', {
        type: 'add',
        index: 1,
        item: this.processList[1]
      })
      this.$nextTick(() => {
        this.initDrag(task.id, 'iv-bd-wrapper', false)
        this.addEndpoint(task)
      })
      this.currentDownTarget = null
    },
    dragBodyStop (e) {
      let el = this.currentDownTarget
      let index = this.getIndex(el)
      let target = window.getComputedStyle(el)
      this.$emit('on-drag-stop', {
        type: 'update',
        index: index,
        item: this.processList[index]
      });
      ({left: this.processList[index].left, top: this.processList[index].top} = {left: parseInt(target.left), top: parseInt(target.top)})
    },
    //取消当前
    cancelDelete () {
      if (this.innerFlag) {
        this.innerFlag = false
        return
      }
      this.currentDownTarget = this.currentCon = null
    },
    connect (item) {
      this.jsPlumb.ready(() => {
        for (let key in item.anchor) {
          let val = item.anchor[key]
          if (!item[val] || !item[val].length) continue
          if (item.id === 'Start') (this.startTaskFlag = true)
          item[val].forEach(uuid => {
            this.jsPlumb.connect({
              uuids: [val, uuid]
            })
          })
        }
      })
    },
    addEndpoint (item) {
      this.jsPlumb.ready(() => {
        ['Top', 'Right', 'Left', 'Bottom', 'TopRight', 'TopLeft', 'BottomRight', 'BottomLeft'].forEach(dic => {
          this.jsPlumb.addEndpoint(item.id, {
            anchors: dic,
            uuid: item.anchor[dic],
            ...this.common
          })
        })
      })
    },
    repain () {
      this.jsPlumb.repaintEverything()
    }
  }
}
</script>
<style lang='scss' scoped>
@import 'variable/variable.scss';
.iv-mainprocess-wrapper {
  position: relative;
  //头部信息
  .iv-hd-wrapper {
    margin: 0 $three-double $three-double $three-double;
    background:rgba(0,0,0,0.04);
    overflow: hidden;
    padding: 0 $two-double;
    .iv-hd-item {
      padding: 0 $one-double;
      margin: ($three-double - 6) $one-double ($three-double - 6) 0;
      background: #fff;
      border-radius: 4px;
      position: relative;
    }
    .iv-m-r-4 {
      margin-right: 4px;
    }
    .iv-m-l-4 {
      margin-left: 4px;
    }
  }
  //内容区域
  .iv-bd-wrapper {
    min-height: 300px;
    position: relative;
    .iv-process-item {
      position: absolute;
      border:1px solid rgba(0,0,0,0.15);
      background:rgba(0,0,0,0.04);
      border-radius:4px;
      padding: 5px $three-double;
      span {
        margin-left: 8px;
      }
    }
    .iv-process-placeholder-item {
      visibility: hidden;
    }
  }
}
</style>
<style lang='scss'>
//jsPlumb样式调整
.katavorio-clone-drag {
  border: 1px dashed rgba(0, 0, 0, .15);
  padding: 0 8px;
}
.iv-preview-wrapper {
  .jtk-endpoint.jtk-endpoint-anchor {
    opacity: 0;
  }
}
#iv-bd-wrapper {
  &.iv-show-anchor {
    .jtk-droppable.jtk-endpoint-anchor {
      // visibility: initial;
    }
  }
  .jtk-endpoint-anchor {
    // visibility: hidden;
  }
}
</style>
