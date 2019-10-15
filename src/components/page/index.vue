<template>
    <div
      :class="{'iv-isBorder': isBorder}"
      class="iv-page-wrapper">
      <div
        @click="changePage"
        :style="{padding: size === 'small' ? '0px' : '4px'}"
        class="iv-pull-right iv-page-jump iv-text-center iv-fs-14 iv-pointer iv-hover-border-color">GO</div>
      <Page
      class="iv-pull-right iv-page-component uit-page-wrapper"
      ref="Page"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :page-size-opts="pageSizeOpts"
      :placement="placement"
      :transfer="transfer"
      :size="size"
      :simple="simple"
      :show-total="showTotal"
      :show-elevator="showElevator"
      :show-sizer="showSizer"
      :class-name="className"
      :styles="styles"
      @on-change="onChange"
      @on-page-size-change="onPageSizeChange">
      </Page>
    </div>
</template>
<script>
import {Page} from 'iview'
function isIn (value = '', array = []) {
  return array.indexOf(value) >= 0
}
export default {
  props: {
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizeOpts: {
      type: Array,
      default () {
        return [10, 20, 30, 40]
      }
    },
    /*条数切换弹窗的展开方向，可选值为 bottom 和 top*/
    placement: {
      validator (value) {
        return isIn(value, ['top', 'bottom'])
      },
      default: 'bottom'
    },
    /*是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果*/
    transfer: {
      type: Boolean,
      default: true
    },
    size: {
      validator (value) {
        return isIn(value, ['small'])
      }
    },
    simple: {
      type: Boolean,
      default: false
    },
    showTotal: {
      type: Boolean,
      default: true
    },
    showElevator: {
      type: Boolean,
      default: true
    },
    showSizer: {
      type: Boolean,
      default: true
    },
    className: {
      type: String
    },
    styles: {
      type: Object
    },
    isBorder: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Page
  },
  methods: {
    onChange () {
      this.$emit('on-change', ...arguments)
    },
    onPageSizeChange () {
      this.$emit('on-page-size-change', ...arguments)
    },
    changePage () {
      let PageInstance = this.$refs.Page
      let target = PageInstance.$el.querySelector('.ivu-page-options-elevator input')
      let page = ~~(target.value)
      if (page > PageInstance.allPages) {
        page = PageInstance.allPages
      } else if (page <= 0 || !page) {
        page = 1
      }
      PageInstance.changePage(page)
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-page-wrapper {
    padding: 4px 0;
    overflow: hidden;
    margin: 0 $three-double $three-double $three-double;
    &.iv-isBorder {
      border: 1px solid #dddee1;
      border-top: 0 none;
      background: #f8f8f9;
      .iv-page-jump {
        margin-right: $two-double;
      }
    }
    .iv-page-component {
        padding: 0 8px 0 16px;
    }
    .iv-page-jump {
      padding: 4px;
      border: 1px solid #dddee1;
      border-radius: 4px;
      transition: border-color .2s linear 0s;
    }
}
</style>
