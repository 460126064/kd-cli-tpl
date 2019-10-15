<template>
  <Alert
    class="iv-alert-wrapper"
    v-bind="$attrs"
    show-icon>
    <slot></slot>
  </Alert>
</template>
<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-alert-wrapper {
  margin: 0 $three-double $two-double $three-double;
}
</style>
