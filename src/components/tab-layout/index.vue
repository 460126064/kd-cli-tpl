<template>
  <div>
    <ul class="iv-fs-16 iv-tab-wrapper">
      <li
        v-for="(item, $index) in list"
        :key="$index"
        @click="onClick(item, $index)"
        :class="{'iv-main-border-color iv-main-color': activeIdx === $index}"
        class="iv-pull-left iv-hover-color iv-pointer iv-hover-border-color">{{item.title}}</li>
    </ul>
    <div class="iv-tab-body">
      <slot>
        <keepAlive :include="include">
          <component
            :ref="list[activeIdx].ref || ''"
            v-bind="list[activeIdx].props || {}"
            v-on="list[activeIdx].on || {}"
            :is="currentCom"></component>
        </keepAlive>
      </slot>
    </div>
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
    activeIndex: {
      type: Number,
      default: 0
    },
    include: {
      type: [RegExp, String, Array],
      default () {
        return ['']
      }
    }
  },
  data () {
    return {
      activeIdx: this.activeIndex,
      currentCom: null
    }
  },
  watch: {
    activeIndex (val) {
      this.activeIdx = val
    },
    activeIdx: {
      immediate: true,
      handler (val) {
        //判断是否为异步组件渲染
        if (this.$slots.default && this.$slots.default.length) return
        try {
          this.currentCom = (this.list[val]).component
        } catch (err) {
          console.error('当前tab选项不存在或者tab异步组件，必须传入component参数')
        }
      }
    }
  },
  components: {},
  created () {
    this.onClick(this.list[this.activeIdx], this.activeIdx)
  },
  methods: {
    onClick (item, $index) {
      this.activeIdx = $index
      this.$emit('on-click', item, $index)
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-tab-wrapper {
  overflow: hidden;
  margin: (-$three-double) (-$three-double) ($three-double) (-$three-double);
  padding: 0 $three-double;
  background: #fff;
  li {
    margin-right: ($three-double * 2);
    padding-bottom: $two-double;
    border-bottom: 2px solid transparent;
    transition: all .2s linear 0s;
  }
}
</style>
