<template>
  <div :style="styles">
  </div>
</template>
<script>
import echarts from'echarts/lib/echarts'
import "echarts/lib/component/legend"
import "echarts/lib/component/tooltip"
import "echarts/lib/component/title"
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
export default {
  props: {
    options: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    width: {
      type: [Number, String],
      default: 50
    },
    height: {
      type: [Number, String],
      default: 50
    }
  },
  data () { return {} },
  created () {
    this.map = new Map()
    this.map.set('string', (val) => {
      return val
    })
    this.map.set('number', (val) => {
      return `${val}px`
    })
  },
  computed: {
    styles () {
      let widthFn = this.map.get(typeof this.width)
      let heightFn = this.map.get(typeof this.height)
      return {
        width: widthFn && widthFn(this.width),
        height: heightFn && heightFn(this.height)
      }
    }
  },
  watch: {
    options () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const myChart = echarts.init(this.$el)
      myChart.setOption(this.options)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
