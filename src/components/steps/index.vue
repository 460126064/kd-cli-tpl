<template>
  <div>
    <FormLayout>
      <div
        class="iv-steps-wrapper">
        <Steps
          :current="stepIndex">
          <Step
            v-for="(item, $index) in list"
            :key="$index"
            :title="item.title"
            :content="item.content" />
        </Steps>
      </div>
    </FormLayout>
    <div>
      <slot></slot>
    </div>
    <FooterOperator>
      <slot name="operator">
        <Button
          type="ghost"
          v-if="showCancel"
          @click="onCancel"
          class="iv-m-r-8 uit-cancel">取&nbsp;消</Button>
        <Button
          type="ghost"
          v-if="stepIndex != 0"
          @click="onStep('prev')"
          class="iv-m-r-8 uit-prev">上一步</Button>
        <Button
          type="primary"
          v-if="stepIndex >= 0"
          @click="onStep('next')"
          class="iv-m-r-8 uit-ok">
          {{stepIndex >= list.length - 1 ? '保&emsp;存' : '下一步'}}
        </Button>
      </slot>
    </FooterOperator>
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
    },
    isSkip: {
      type: Boolean,
      default: true
    },
    current: {
      type: Number,
      default: 0
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    autoStep: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      stepIndex: this.current
    }
  },
  created () {
    this.factroy = {
      next () {
        let idx = this.stepIndex
        let length = this.list.length
        idx = idx + 1 >= length ? idx : ++idx
        this.onSteps(this.list[idx], idx)
      },
      prev () {
        let idx = this.stepIndex
        idx = idx - 1 < 0 ? 1 : --idx
        this.onSteps(this.list[idx], idx)
      },
      random (item, idx) {
        this.onSteps(item, idx)
      }
    }
  },
  watch: {
    current (newVal) {
      this.stepIndex = newVal
    }
  },
  methods: {
    onSteps (item, $index) {
      this.autoStep && (this.stepIndex = $index)
      this.$emit('on-steps', {
        item,
        index: $index,
        resolve: () => {
          !this.autoStep && (this.stepIndex = $index)
        },
        done: this.stepIndex >= this.list.length - 1
      })
    },
    onStep (type) {
      if (!this.isSkip) return
      let args = [...arguments].slice(1)
      this.factroy[type] && this.factroy[type].apply(this, args)
    },
    onCancel () {
      this.$emit('on-cancel')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
  .iv-steps-wrapper {
    .ivu-steps-head-inner {
      width: 24px !important;
      height: 24px !important;
      line-height: 22px !important;
    }
  }
</style>
