<template>
  <LayoutFull
    class="iv-treelist-layout">
    <div class="iv-layout-list-wrapper" :class="{'iv-overhide': isMiddle}">
      <div v-if="showTree"
           :class="isInModel ? 'iv-inmodel-left-tree' : 'iv-outmodel-left-tree'"
           class="iv-pull-left iv-left-tree">
        <div
          :class="{'iv-max-height': isMiddle}"
          :style="{width: `${treeWidth}px`}"
          class="iv-tree-wrapper iv-p-8">
          <slot name="layout-tree"></slot>
        </div>
      </div>
      <Panel
        :padding="contentPadding"
        :class="classes"
        class="iv-right-list-wrapper">
        <BoxModal>
          <div class="iv-right-list" :class="`iv-p-${padding}`">
            <slot name="layout-content"></slot>
          </div>
        </BoxModal>
      </Panel>
    </div>
    <slot></slot>
  </LayoutFull>
</template>
<script>
/*
   * @description 引入定制化Panel组件，在特定情况下需要引入iview原生Panel,用于设置布局组件的间距
   * @example
   * import {Panel} from 'iview'
   */
import Panel from '@/components/panel'
import LayoutFull from '@/components/layout/layout-full'
import BoxModal from '@/components/base/box-model'
import {findComponentUpward} from '@/utils'
import {mapGetters} from 'vuex'
export default {
  name: 'TreeListLayout',
  props: {
    showTree: {
      type: Boolean,
      default: true
    },
    padding: {
      type: String,
      default: '0'
    },
    contentPadding: {
      type: String,
      default: '0'
    },
    isMiddle: {
      type: Boolean,
      default: false
    },
    autoHeight: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isInModel: this.autoHeight
    }
  },
  computed: {
    classes () {
      return {
        'iv-right-inmodal': this.isInModel
      }
    },
    ...mapGetters([
      'treeWidth'
    ])
  },
  created () {
    this.isCreated = true
    //初始化是否在模态框中
    findComponentUpward(this, ['BigModal', 'Modal']) && (this.isInModel = true)
  },
  components: {
    Panel,
    BoxModal,
    LayoutFull
  }
}
</script>
<style lang="scss" scoped>
  @import 'variable/variable.scss';
  .iv-right-list-wrapper {
    min-height: calc(100vh - 191px) !important;
    background: #fff;
    &.iv-right-inmodal {
      min-height: auto !important;
      // background: #eee;
    }
  }
  .iv-overhide {
    overflow: hidden;
  }
  .iv-left-tree {
    &.iv-inmodel-left-tree {
      margin-right: 0;
      border: 1px solid rgba(0, 0, 0, .09);
    }
    &.iv-outmodel-left-tree {
      margin-right: $three-double;
    }
    .iv-tree-wrapper {
      background: #fff;
      height: calc(100vh - 191px);
      overflow: auto;
      transition: width .2s linear 0s;
      &.iv-max-height {
        height: 436px;
      }
    }
  }
  .iv-right-list-wrapper {
    overflow: hidden;
  }
</style>
<style lang="scss">
  .iv-left-tree {
    .iv-tree-wrapper {
      .iv-search-wrapper {
        .ivu-icon {
          right: 5px;
        }
      }
      .ivu-tree-title {
        color: rgba(0, 0, 0, .85)
      }
    }
  }
</style>
