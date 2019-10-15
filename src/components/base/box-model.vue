<template>
  <div
    :class="layout"
    class="iv-box-model-wrapper iv-symbol-mb16">
    <slot></slot>
  </div>
</template>
<script>
import {findComponentUpward} from '@/utils'
export default {
  props: {
    contain: {
      type: Boolean,
      default: false
    },
    upward: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isList: false
    }
  },
  computed: {
    layout () {
      return [
        this.contain ? 'iv-padding-lr' : '',
        this.upward ? 'iv-upward-t' : '',
        this.isList ? 'iv-cover-fullscreen' : ''
      ]
    }
  },
  mounted () {
    findComponentUpward(this, ['TreeListLayout']) && (this.isList = true)
  }
}
</script>

<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-box-model-wrapper {
  background: #fff;
  overflow: hidden;
  &.iv-padding-lr {
    padding-left: 0 $three-double;
    padding-right: 0 $three-double;
  }
  &.iv-upward-t {
    padding-top: -$three-double;
  }
}
</style>
