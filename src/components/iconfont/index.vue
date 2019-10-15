<template>
  <i :class="classes" class="icon iconfont" @click="handleClick"></i>
</template>
<script>
const prefixCls = 'icon'
export default {
  name: 'Icon',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    classes () {
      return `${prefixCls}-${this.type}`
    }
  },
  methods: {
    handleClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>
