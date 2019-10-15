<script>
export default {
  name: 'Expand',
  functional: true,
  props: {
    render: {
      type: Function,
      default () {
        return function () {}
      }
    },
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  render (c, ctx) {
    return ctx.props.render(c, ctx.props.item)
  }
}
</script>
<style lang="scss" scoped>

</style>
