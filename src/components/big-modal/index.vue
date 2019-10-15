<template>
  <div v-transfer-dom :data-transfer="transfer">
    <transition name="iv">
      <div class="iv-big-modal iv-position" v-if="visible">
        <div class="iv-modal-mask iv-position"></div>
        <template>
          <div class="iv-modal-wrapper iv-position">
            <div class="iv-modal-content iv-modal-center" >
              <div class="iv-modal-header">
                <div class="iv-modal-header-wrap">
                  <slot name="modal-header">
                    <span class="iv-pull-left iv-m-t-16 iv-fs-16 iv-fc-85 iv-fw-b" :class="`iv-text-${textAlign}`"
                          v-text="title"></span>
                    <Icon type="close" @click="onCancel" class="iv-pull-right iv-fs-16 iv-m-t-16 iv-modal-close"></Icon>
                  </slot>
                </div>
              </div>
              <div class="iv-modal-content-info"
                   :class="overflowScroll ? 'iv-modal-scroll' : ''">
                <slot name="modal-content">
                </slot>
              </div>
              <div class="iv-modal-footer">
                <div class="iv-text-center">
                  <slot name="modal-footer">
                    <div v-if="isEdit" >
                      <Button
                        type="primary"
                        @click="onOk"
                        v-if="showEdit"
                        :disabled="disabled"
                        class=" uit-bigmodal-save"
                        size="large">{{closeText}}</Button>
                      <Button
                        type="ghost"
                        @click="onCancel"
                        class="  iv-m-r-12  uit-bigmodal-cancel"
                        size="large">取消</Button>
                    </div>
                    <div v-else >
                      <Button
                        type="ghost"
                        @click="onCancel"
                        class="uit-bigmodal-close"
                        size="large">{{closeText}}</Button>
                    </div>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>
<script>
import transferDomDerective from '@/directives/transfer-dom'
export default {
  name: 'BigModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    textAlign: {
      type: String,
      default: 'left'
    },
    title: {
      type: String,
      default: '新增'
    },
    overflowScroll: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    closeText: {
      type: String,
      default: '保存'
    },
    transfer: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.value
    }
  },
  directives: {
    'transfer-dom': transferDomDerective
  },
  watch: {
    value (val) {
      this.visible = val
    }
  },
  methods: {
    onOk () {
      this.$emit('on-ok')
    },
    onCancel () {
      this.visible = false
      this.$emit('input', false)
      this.$emit('on-cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/static/lib/css/base/variable.scss';
  .iv-big-modal {
    .iv-modal-mask {
      position: absolute;
      background: rgba(0, 0, 0, .65);
      z-index: 980;
    }
    .iv-modal-wrapper {
      position: absolute;
      z-index: 999;
      .iv-modal-content {
        background: #fff;
        height: calc(100% - 160px);
        margin-top: 80px !important;
        border-radius: $iv-border-radius;
        position: relative;
        overflow: hidden;
        .iv-modal-content-info{
          height: calc(100% - 112px);
        }
      }
      .iv-modal-scroll {
        overflow-y: auto;
      }
      .iv-modal-header {
        z-index: 10;
        top: 80px;
        border-radius: 10px 10px 0 0;

      }
      .iv-modal-header-wrap {
        width: 100% !important;
        padding:0 $three-double;
      }
      .iv-modal-header, .iv-modal-footer {
        height: 56px;
        width: 100%;
        background: #fff;
        line-height: 56px;
        border-bottom: 1px solid  $iv-border-color;
      }
      .iv-modal-footer {
        z-index: 9;
        background: #fff;
        /*position: fixed;*/
        border-top: 1px solid  $iv-border-color;
        border-radius: 0 0 10px 10px;
        /deep/ button {
          margin-right: 8px;
        }
      }
      .iv-modal-center {
        width: calc(100% - 304px);
        margin: 0 auto;
      }
      .iv-modal-close {
        cursor: pointer;
      }
    }
  }
  .iv-position {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
  }
  .iv-big-modal {
    position: fixed;
    z-index: 999;
  }
  .iv-enter-active, .iv-leave-active {
    transition: all .3s linear 0s;
  }
  .iv-enter, .iv-leave-to {
    transform: translate3d(0, 100%, 0)
  }
</style>
