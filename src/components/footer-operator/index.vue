<template>
  <div class="iv-footer-operator-wrapper iv-text-center">
    <span
      class="iv-p-l-24 iv-fs-14 iv-pull-left iv-coverinfo iv-fc-65 uit-show-list"
      v-if="showCover">
      <Icon type="information-circled" class="iv-m-r-8 iv-main-color"></Icon>
      {{coverInfo}}
    </span>
    <slot>
      <Button
        type="primary"
        class="uit-ok"
        @click="onOk">
          <span v-html="saveText"></span>
        </Button>
      <Button
        type="ghost"
        class="iv-m-l-8 uit-cancel"
        @click="onCanel">
        <span v-html="cancelText"></span>
      </Button>
    </slot>
  </div>
</template>
<script>
export default {
  props: {
    coverInfo: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取&nbsp;消'
    },
    saveText: {
      type: String,
      default: '保&nbsp;存'
    },
    showCover: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    let el = document.querySelector('.iv-article-wrapper')
    el.classList.add('iv-not-detail-wrapper')
    this.$on('hook:destroyed', () => {
      el.classList.remove('iv-not-detail-wrapper')
    })
    this.$on('hook:deactivated', () => {
      el.classList.remove('iv-not-detail-wrapper')
    })
    this.$on('hook:activated', () => {
      el.classList.add('iv-not-detail-wrapper')
    })
  },
  methods: {
    onCanel () {
      this.$emit('on-cancel')
    },
    onOk () {
      this.$emit('on-ok')
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-footer-operator-wrapper {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  background: #fff;
  z-index: 9;
  text-align: right;
  padding: 12px $three-double;
  span.iv-coverinfo {
    margin-left: 260px;
  }
}
</style>
<style lang="scss">
@import 'variable/variable.scss';
.iv-not-detail-wrapper {
  margin-bottom: 48 + $three-double;
}
</style>
