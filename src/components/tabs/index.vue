<template>
  <TreeListLayout :padding="$attrs.padding" :showTree="false">
    <div slot="layout-content" class="iv-tabs-wrapper">
      <ul style="overflow: hidden;">
        <li
          v-for="(item, $index) in list"
          :key="$index"
          :class="currentActive === $index ? 'iv-border-main-color iv-main-color' : ''"
          @click="onClick($index, item)"
          class="iv-pull-left iv-fs-16 iv-m-r-40 iv-pointer iv-hover-color iv-hover-border-color">{{item.title}}</li>
        <slot name="title"></slot>
      </ul>
      <component class="iv-tabs-list" v-on="comListeners || $listeners" v-bind="comProps || $attrs.props" :class="$attrs.class" :is="currentCom"></component>
    </div>
  </TreeListLayout>
</template>
<script>
import TreeListLayout from '@/page/business/treelist-layout'
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    current: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentCom: '',
      currentActive: this.current
    }
  },
  watch: {
    current: {
      handler (newVal) {
        this.currentActive = newVal
      },
      sync: true
    },
    list () {
      this.setComponent(this.list[this.current])
    }
  },
  created () {
    this.comProps = null
    this.setComponent(this.list[this.current])
  },
  components: {
    TreeListLayout
  },
  methods: {
    onClick (index, item) {
      this.setComponent(item, index)
      this.$emit('on-click', {
        index,
        item
      })
    },
    setComponent (item, idx) {
      this.currentActive = idx || 0
      this.currentCom = item.tag
      this.comProps = item.props
      this.comListeners = item.listeners
      if (this.$options.components[item.tag]) return
      this.$options.components[item.tag] = item.component
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-tabs-wrapper {
  border-bottom: 1px solid rgb(238, 238, 238);
  & > ul {
    padding: 0 $three-double;
    border-bottom: 1px solid rgba(0, 0, 0, .09);
    li {
      padding-bottom: $two-double;
    }
  }
  li {
    // padding: 16px 0;
    border-bottom: 2px solid transparent;
    transition: all .1s linear 0s;
    &.iv-border-main-color {
      border-color:  #1890FF;
    }
  }
}
.iv-m-r-40 {
  margin-right: 40px;
}
</style>
