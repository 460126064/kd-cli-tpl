<template>
  <div class="iv-panel-wrapper">
    <div class="iv-panel-content" :class="'iv-p-'+($attrs.padding||24)">
      <div class="iv-panel-header">
        <slot name="panel-header"></slot>
      </div>
      <div class="iv-panel-body">
        <slot></slot>
      </div>
      <div class="iv-panel-footer">
        <slot name="panel-footer"></slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/static/lib/css/base/variable.scss';
.iv-panel-wrapper {
  min-height: 100px;
  .iv-panel-content {
    border-radius: 4px;
  }
}
</style>
