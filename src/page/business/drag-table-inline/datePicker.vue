<template>
  <Tooltip
    class="iv-tooltip"
    :disabled="tooltipDisable"
    :content="content"
    placement="top"
    :delay="500">
    <DatePicker
      v-model="val"
      confirm
      type="datetimerange"
      placeholder="请选择"
      v-bind="props"
      @on-ok="onOk"
      @on-clear="onClear"/>
  </Tooltip>
</template>

<script>
import { timeFormat } from '@/utils'

export default {
  name: 'datePicker',
  props: {
    value: {
      default: ''
    },
    props: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    tooltipDisable () {
      return !(!!this.val[0] && !!this.val[0])
    },
    content () {
      let [to, from] = this.val
      if (!to || !from) return ''
      to = timeFormat(to, 'yyyy-MM-dd HH:mm:ss')
      from = timeFormat(from, 'yyyy-MM-dd HH:mm:ss')
      return `${to} 至 ${from}`
    }
  },
  data () {
    return {
      val: this.value
    }
  },
  methods: {
    onOk () {
      this.$emit('on-ok', this.val)
    },
    onClear () {
      this.$emit('on-clear', this.val)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "variable/variable.scss";
  .iv-tooltip {
    /deep/ .ivu-tooltip-inner {
      white-space: normal;
      max-width: 400px;
    }
  }
</style>
