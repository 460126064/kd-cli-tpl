<template>
  <div
    :class="{'iv-border': border}"
    class="iv-main-title-wrapper iv-symbol-pb16 iv-symbol-pl16 iv-symbol-pr16 iv-fw-b iv-fs-18">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    border: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'variable/variable.scss';
  .iv-main-title-wrapper {
    background: #fff;
    &.iv-border {
      border-bottom: 1px solid rgba(0, 0, 0, .04);
    }
  }
</style>
