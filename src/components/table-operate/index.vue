<template>
  <div>
    <ul
      v-if="item.isEdit"
      class="iv-operate-wrapper">
      <li
        v-if="showSave && filterSave(item)"
        class="iv-operate-item iv-pull-left">
        <a
          class="iv-main-color iv-main-hover-color uit-edit uit-save-list"
          @click="save">保存</a>
      </li>
      <li class="iv-operate-item iv-pull-left">
        <a
          class="iv-main-color iv-main-hover-color uit-cancel-list"
          @click="cancelSave">取消</a>
      </li>
    </ul>
    <ul v-else class="iv-operate-wrapper">
      <li
        class="iv-operate-item iv-pull-left"
        v-if="showEdit && filterEdit(item)">
        <a
          class="iv-main-color iv-main-hover-color uit-edit-list"
          @click="edit">编辑</a>
      </li>
      <li
        class="iv-operate-item iv-pull-left"
        v-if="showDelete && filterDelete(item)">
        <DeletePoptip
          :transfer="true"
          :title="`你确定${deleteTitle}此条数据吗？`"
          @on-ok="confrim">
          <a class="iv-main-color iv-main-hover-color uit-delete-list">{{deleteTitle}}</a>
        </DeletePoptip>
      </li>
      <li
        v-if="hasChild"
        class="iv-operate-item iv-pull-left iv-operate-item-slot"><slot name="operate"></slot></li>
    </ul>
  </div>
</template>
<script>
import DeletePoptip from '@/components/poptip'
export default {
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    showSave: {
      type: Boolean,
      default: true
    },
    isOutside: {
      type: Boolean,
      default: true
    },
    //向下兼容，忽略此属性
    compatible: {
      type: Boolean,
      default: true
    },
    deleteTitle: {
      type: String,
      default: '删除'
    }
  },
  components: {
    DeletePoptip
  },
  inject: {
    deleteItem: {
      default () {
        return () => {
          /*eslint-disable*/
          return new Promise( () => {})
        }
      }
    },
    saveItem: {
      default () {
        return () => {
          /*eslint-disable*/
          return new Promise( () => {})
        }
      }
    },
    changeEdit: {
      default () {
        return () => {
          /*eslint-disable*/
          return new Promise( () => {})
        }
      }
    },
    removeAdd: {
      default () {
        return () => {
          /*eslint-disable*/
          return new Promise( () => {})
        }
      }
    },
    filterDelete: {
      default () {
        return () => {
          return true
        }
      }
    },
    filterEdit: {
      default () {
        return () => {
          return true
        }
      }
    },
    filterSave: {
      default () {
        return () => {
          return true
        }
      }
    }
  },
  data () {
    return {
      hasChild: true
    }
  },
  mounted () {
    let el = this.$el.querySelector('.iv-operate-item-slot')
    if (el && el.firstElementChild && el.firstElementChild.firstElementChild) ( this.hasChild = true )
    else ( this.hasChild = false )
  },
  methods: {
    /**
     * 编辑
     */
    edit () {
      //缓存当前值,以备取消使用
      this.catchData = Object.assign({}, this.item)
      this.compatible && this.$set(this.item, 'isEdit', true)
      // //触发外层编辑
      this.changeEdit(this.index, this.item)
    },
    confrim (childComponent) {
      this.deleteItem(this.item).then((res) => {
        this.compatible && this.$set(this.item, 'isEdit', false)
        childComponent.visible = false
        this.$Message.success(`${this.deleteTitle}成功`)
      })
    },
    save () {
      this.saveItem(this.item).then((res) => {
        this.$set(this.item, 'isEdit', false)
        this.$Message.success(`保存成功`)
      })
    },
    cancelSave () {
      this.$set(this.item, 'isEdit', false)
      //如果存在校验，则初始化
      this.item.errorQueue && (this.item.errorQueue = null)
      //如果是新增，我们直接删除
      this.removeAdd(this.index)
      //触发外层编辑,如果是单独引用触发，兼容旧版
      this.isOutside && this.changeEdit(this.index, this.item)
      //保持原有值
      if (!this.catchData) return
      let keys = Object.keys(this.catchData)
      keys.map(key => {
        this.item[key] = this.catchData[key]
      })
      this.catchData = null
    }
  }
}
</script>
