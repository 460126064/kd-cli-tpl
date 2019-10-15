<script>
import {Modal} from 'iview'
export default {
  name: 'Modal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'large'
    },
    map: {
      type: Object,
      default () {
        return {}
      }
    },
    isMiddle: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showModal: false
    }
  },
  computed: {
    width () {
      return this.map[this.size]
    }
  },
  watch: {
    value (newVal) {
      this.$nextTick(() => {
        this.showModal = newVal
        !newVal && this.removeHidden()
        newVal && this.addUitClass()
      })
    }
  },
  created () {
    let defaultMap = {
      large: '768',
      small: '416'
    }
    this.map = Object.assign(this.map, defaultMap)
  },
  render (c) {
    return this.value ? c('div', {}, [
      c(Modal, {
        props: {
          value: this.showModal,
          width: this.width,
          maskClosable: false
        },
        attrs: {
          ...this.$attrs
        },
        ref: 'customModal',
        class: {
          'iv-custom-modal': true,
          'iv-middle': this.isMiddle
        },
        scopedSlots: {
          default: props => {
            return c('div', this.$slots.default)
          },
          ...this.$slots.header ? {
            header: props => {
              return c('div', this.$slots.header)
            }
          } : {},
          ...this.$slots.footer ? {
            footer: props => {
              return c('div', this.$slots.footer)
            }
          } : {
            footer: props => {
              return c('div', {}, [
                c('Button', {
                  props: {
                    type: 'primary'
                  },
                  nativeOn: {
                    click: () => {
                      this.$emit('on-ok')
                    }
                  }
                }, '确定'),
                c('Button', {
                  nativeOn: {
                    click: () => {
                      this.showModal = false
                      this.$emit('input', false)
                      this.$emit('on-cancel')
                    }
                  }
                }, '取消')
              ])
            }
          }
        },
        on: {
          input: (event) => {
            this.showModal = false
            this.removeHidden()
            this.$emit('input', event)
          },
          'on-ok': () => {
            this.$emit('on-ok')
          },
          'on-cancel': () => {
            this.$emit('on-cancel')
          },
          'on-visible-change': res => this.$emit('on-visible-change', res)
        }
      }, [this.$slots.header ? c('div', {
        slot: 'header'
      }, this.$slots.header) : ''])
    ]) : c('')
  },
  methods: {
    close () {
      this.$refs.customModal.visible = false
      this.$emit('input', false)
      this.showModal = false
      this.removeHidden()
    },
    removeHidden () {
      let ishidden = document.body.style.overflow === 'hidden'
      ishidden && (document.body.style.overflow = 'initial')
    },
    addUitClass () {
      //无法装饰者模式修改，只能使用原生侵入式修改DOM
      let footerEl = document.querySelector('.iv-custom-modal .ivu-modal-footer')
      if (!footerEl) return
      footerEl.children[0] && footerEl.children[0].classList.add('iv-custom-modal-cancel')
      footerEl.children[1] && footerEl.children[1].classList.add('iv-custom-modal-save')
    }
  }
}
</script>
<style lang="scss">
@import 'variable/variable.scss';
.iv-custom-modal {
  .ivu-btn-loading {
    pointer-events: initial;
    &:before {
      display: none;
    }
    i {
      display: none;
    }
    span {
      margin-left: 0;
    }
  }
  .ivu-modal-close {
    right: $three-double;
    top: (($three-double * 2) - 13) / 2;
  }
  .ivu-modal-footer {
    text-align: center;
    .ivu-btn-text {
      border-color: #dddee1;
    }
  }
  .ivu-modal-header {
    padding: $three-double;
    .ivu-modal-header-inner {
      font-size: 16px;
    }
  }
  .ivu-modal-body {
    padding: 0;
    max-height: 436px;
    min-width: 236px;
    overflow: auto;
  }
  &.iv-middle {
    .ivu-modal-body {
      padding: 0;
    }
  }
}
</style>
