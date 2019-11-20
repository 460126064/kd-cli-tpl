<script>
export default {
  functional: true,
  props: {
    vNode: {
      type: Object,
      default () {
        return null
      }
    }
  },
  render (h, ctx) {
    return (
      <div class="iv-formlayout-wrapper iv-cover-input">
        {ctx.props.vNode || ctx?.slots()?.default}
      </div>
    )
  }
}
</script>
<style lang="scss">
@import '@/static/lib/css/base/variables/symbol.scss';
.iv-formlayout-wrapper {
  margin: (-$iv-symbol-m8) (-$iv-symbol-m12);
  .ivu-form-item {
    margin: $iv-symbol-m8 $iv-symbol-m12;
  }
  .ivu-form-item-label {
    padding: 0 !important;
  }
}
</style>
