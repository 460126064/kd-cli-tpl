<template>
  <div
    class="iv-p-16 iv-input-tag iv-pointer iv-hover-border-color">
    <Tag
      v-for="(item, $index) in list"
      :key="$index"
      @on-close="onClose($index)"
      closable>{{item.label}}</Tag>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    onClose (index) {
      this.list.splice(index, 1)
      this.$emit('on-close', index)
    }
  }
}
</script>
<style lang="scss" scoped>
  .iv-input-tag {
    border: 1px solid #eee;
    border-radius: 4px;
    width: 100%;
    transition: border-color .2s linear 0s;
  }
</style>
