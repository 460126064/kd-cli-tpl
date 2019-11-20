<script>
export default {
  functional: true,
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  },
  render (h, ctx) {
    const {props} = ctx
    return (
      <div>
        {
          props.readOnly ? (<div class={[[ctx.props.disabled && 'iv-is-disabled'], props.isGroup && 'iv-readonly-formlayout-wrapper']}>
            {ctx?.slots()?.default}
          </div>) : (
            <div class="iv-readonly-formlayout-wrapper">
              {ctx?.slots()?.default}
            </div>
          )
        }
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
  @import '@/static/lib/css/base/variables/symbol.scss';
  .iv-readonly-formlayout-wrapper {
    border-radius:4px;
    padding: $iv-symbol-p8 $iv-symbol-p4;
    margin: $iv-symbol-m8 $iv-symbol-m12;
    border: 1px rgba(0,0,0, .15) solid !important;
    position: relative;
    overflow: hidden;
  }
  .iv-is-disabled {
    /deep/ .ivu-input, /deep/ .ivu-select-selection{
      background: rgba(0,0,0, .08) !important;
      color: rgba(0,0,0, .85)!important;
      border: 0 none !important;
      opacity: 1!important;
      -webkit-text-fill-color: rgba(0,0,0, .85);
    }
    /deep/ .ivu-input[disabled], /deep/ fieldset[disabled] .ivu-input{
      color: #fff;
    }
  }
</style>
