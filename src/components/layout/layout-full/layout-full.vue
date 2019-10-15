<script>
import FormLayout from '@/components/layout/form-layout'
const cache = new Map()
const proxySlot = function (ctx, item, i) {
  let name = item?.slotName
  if (cache.has(name)) return cache.get(name)
  let vNode = ctx.scopedSlots.list ? ctx.scopedSlots.list(item, i) : []
  let res = vNode.find(v => {
    return v?.data?.slot === item?.slotName
  }) || ctx?.scopedSlots?.default?.()
  res && ctx.props.cache && !cache.has(name) && cache.set(name, res)
  delete res?.data?.attrs?.slot
  return res
}
export default {
  functional: true,
  props: {
    list: {
      type: Array,
      default () {
        return [{}]
      }
    },
    cache: {
      type: Boolean,
      default: false
    }
  },
  render (h, ctx) {
    const {props} = ctx
    return (
      <div class="iv-tpl-container">
        {
          props.list.map((item, index) => (
            <div class="iv-tpl-row">
              <div class="iv-tpl-layout">
                <div class="iv-tpl-fill">
                  {
                    !!(item.title || item.renderHead) && <div class="iv-tpl-header iv-symbol-p16 iv-symbol-bb iv-fw-b">
                      { typeof item.title === 'function' ? item.title(item) : item.title }
                      { item.renderHead ? item.renderHead(h, item) : '' }
                    </div>
                  }
                  <div class="iv-tpl-body">
                    <div class="iv-module-container-tb">
                      <div class="iv-module-row">
                        <div class="iv-module-layout-tb">
                          <div class="iv-module-fill">
                            {
                              !!(item.secondTitle || item.renderSecondHead) && <div class="iv-module-header iv-fs-12 iv-fw-b">
                                { typeof item.secondTitle === 'function' ? item.secondTitle(item) : item.secondTitle }
                                { item.renderSecondHead ? item.renderSecondHead(h, item) : '' }
                              </div>
                            }
                            <div class="iv-module-body">
                              {
                                item.formLayout ? (
                                  <FormLayout vNode={proxySlot(ctx, item, index)}>
                                    {proxySlot(ctx, item, index)}
                                  </FormLayout>
                                ) : proxySlot(ctx, item, index)
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.iv-module-body {
  /deep/ .ivu-table-wrapper {
    margin: 0;
  }
  /deep/ .iv-page-wrapper {
    margin: 0;
  }
}
</style>
