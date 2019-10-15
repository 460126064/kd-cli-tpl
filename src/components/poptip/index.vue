<template>
  <Poptip
    :trigger="$attrs.trigger || 'click'"
    title="Title"
    class="iv-poptip-wrapper"
    ref="Poptip"
    :popper-class="popperClass"
    :transfer="transfer"
    @on-popper-show="onPopperShow"
    content="content">
    <div slot="title" class="iv-p-t-8">
      <slot name="title">
        <i class="ivu-icon ivu-icon-information-circled iv-yellow-color iv-m-r-8 iv-fs-16"></i>
        <span class="iv-delete-tips iv-text-left iv-fs-14" v-text="title"></span>
      </slot>
    </div>
    <div slot="content" class="iv-poptip-body-content">
      <slot name="content">
        <Button
          type="primary"
          @click.native="confrim"
          class="iv-pull-right uit-delete-item iv-fs-14 iv-delete-btn">确认</Button>
        <Button type="ghost"
          @click.native="cancel"
          class="iv-pull-right uit-poptip-cancel iv-m-r-8 iv-fs-14 iv-delete-btn">取消</Button>
      </slot>
    </div>
    <slot></slot>
  </Poptip>
</template>
<script>
import {Poptip} from 'iview'
export default {
  props: {
    title: {
      type: String,
      default: '你确定删除此条数据吗？'
    },
    transfer: {
      type: Boolean,
      default: true
    },
    popperClass: {
      type: String,
      default: ''
    }
  },
  components: {
    Poptip
  },
  methods: {
    confrim () {
      this.$emit('on-ok', this.$refs.Poptip)
    },
    cancel () {
      this.$refs.Poptip.visible = false
      this.$emit('on-cancel')
    },
    hide () {
      this.$refs.Poptip.visible = false
    },
    onPopperShow () {
      this.$emit('on-popper-show')
    },
    show () {
      this.$refs.Poptip.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.iv-poptip-wrapper {
  .iv-delete-tips {
    display: inline-block;
    width: 160px;
  }
}
.iv-poptip-body-content {
  .iv-delete-btn {
    padding: 0 9px !important;
  }
}
</style>
<style lang="scss">
.iv-poptip-wrapper {
  .ivu-poptip-title {
    &:after {
      display: none;
    }
  }
  .iv-poptip-body-content {
    overflow: hidden;
    padding-bottom: 12px;
  }
}
</style>
