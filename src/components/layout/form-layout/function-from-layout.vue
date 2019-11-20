<template>
  <div>
    <div class="iv-pos-r">
      <div v-if="showDel" class="iv-triangle-delete-bt iv-pointer" @click="onDel"></div>
      <slot></slot>
    </div>
    <Row v-if="showAdd" :gutter="16" class="iv-symbol-mt16">
      <Col
        :span="24 / btnGroup.length"
        v-for="(item, i) in btnGroup"
        :key="i">
        <div
          @click="onAdd(item)"
          class="iv-add-bt iv-text-center iv-fs-14 iv-pointer iv-symbol-pt8">
          <span class="iv-symbol-pr8">+</span>
          <span>{{ item.label }}</span>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import readonlyFrom from './readonly-from-layout'
export default {
  name: 'function-from-layout',
  components: {readonlyFrom},
  props: {
    index: {
      type: [String, Number],
      default: ''
    },
    showAdd: {
      type: Boolean,
      default: false
    },
    showDel: {
      type: Boolean,
      default: true
    },
    btnGroup: {
      type: Array,
      default () {
        return [{
          label: '新增'
        }]
      }
    }
  },
  methods: {
    onDel () {
      this.$emit('onFromDel', this.index)
    },
    onAdd (item) {
      this.$emit('onFromAdd', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/static/lib/css/base/variables/symbol.scss';
@import '@/static/lib/css/base/variable.scss';
.iv-triangle-delete-bt{
  position: absolute;
  width: 40px;
  height: 40px;
  right: 1px;
  top: 1px;
  background: url(../../../static/images/triangleDel.png) no-repeat;
  background-size: 100% 100%;
  z-index: 10;
}

.iv-add-bt{
  height: 40px;
  border-radius:4px;
  border: 1px rgba(151,151,151,0.45) dashed;
  &:hover {
    color: $iv-main-color;
    border-color: $iv-main-color;
  }
}
</style>
