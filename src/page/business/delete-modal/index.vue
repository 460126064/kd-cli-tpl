<template>
  <!-- 删除确认框 -->
  <div v-if="value">
    <Modal
      size="small"
      @on-cancel="onCancel"
      v-model="isShow">
      <div
        class="iv-text-left iv-fw-b"
        :style="styleColor"
        slot="header">
        <IconFont class="iv-iconfont iv-t-3" :type="iconType"></IconFont>
        <span class=" iv-fs-16 iv-t-2">{{title || tipsMap[type].title}}</span>
      </div>
      <div>
        <FormLayout>
          <slot>
            <p class="iv-prompt-content iv-fc-65 iv-fs-14">{{content || tipsMap[type].content}}</p>
          </slot>
        </FormLayout>
      </div>
      <div slot="footer">
        <Button
          type="ghost"
          @click="onCancel"
          style="margin-right: 5px;"
          class="uit-tipmodal-cancel"
          size="large">取消</Button>
        <Button
          type="primary"
          style="margin: 0;"
          @click="confirm"
          class="uit-tipmodal-save"
          size="large">{{btnText || tipsMap[type].btnText}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Modal from '@/components/modal'
import IconFont from '@/components/iconfont'
const colorMap = {
  red: '#F5222D',
  green: '#52C41A',
  yellow: '#FAAD14'
}
const iconMap = {
  red: 'close-circle-fill',
  green: 'icon-test1',
  yellow: 'question-circle-fill'
}
const tipsMap = {
  red: {
    title: '确认删除',
    content: '确定要删除这些信息吗 ？',
    btnText: '删除'
  },
  green: {
    title: '确认发布',
    content: '确定要发布这些信息吗 ？',
    btnText: '发布'
  },
  yellow: {
    title: '确认撤销',
    content: '确定要撤销这些信息吗 ？',
    btnText: '撤销'
  }
}
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'red'
    }
  },
  data () {
    return {
      isShow: this.value
    }
  },
  created () {
    this.tipsMap = tipsMap
  },
  computed: {
    styleColor () {
      return {
        color: colorMap[this.type]
      }
    },
    iconType () {
      return iconMap[this.type]
    }
  },
  watch: {
    value (newVal) {
      this.$nextTick(() => {
        this.isShow = newVal
      })
    }
  },
  components: {
    Modal,
    IconFont
  },
  methods: {
    confirm () {
      this.$emit('on-ok')
      this.removeHidden()
    },
    onCancel () {
      this.$emit('input', false)
      this.removeHidden()
    },
    removeHidden () {
      let ishidden = document.body.style.overflow === 'hidden'
      ishidden && (document.body.style.overflow = 'initial')
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-iconfont {
  font-size: 21px;
  margin-right: 16px;
  font-weight: normal;
}
.iv-prompt-content {
  padding: 0 $three-double;
}
.iv-t-2 {
  position: relative;
  top: 2px;
}
.iv-t-3 {
  position: relative;
  top: 3px;
}
</style>
