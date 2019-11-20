<script>
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
  //重置for循环语句
  res.data.refInFor = true
  return res
}
export default {
  functional: true,
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    cache: {
      type: Boolean,
      default: false
    },
    simple: {
      type: Boolean,
      default: true
    }
  },
  render (h, ctx) {
    const {props} = ctx
    return (
      <div class="iv-module-container">
        {
          props.list.length
            ? props.list.map((item, index) => (
              <div class="iv-module-row">
                <div class="iv-module-layout">
                  <div class="iv-module-fill">
                    <div class="iv-header iv-fw-b iv-symbol-pb16 iv-fs-12">
                      {
                        ctx.scopedSlots.header
                          ? ctx.scopedSlots.header()
                          : item.title
                            ? typeof item.title === 'function' ? item.title(item) : item.title
                            : ''
                      }
                    </div>
                    <div class="iv-body">
                      { proxySlot(ctx, item, index) }
                      { ctx?.scopedSlots?.default?.() }
                    </div>
                  </div>
                </div>
              </div>
            ))
            : <div class="iv-module-row">
              <div class="iv-module-layout">
                <div class="iv-module-fill">
                  <div class="iv-header iv-fw-b">
                    { ctx?.scopedSlots?.header?.() }
                  </div>
                  <div class="iv-body">
                    { ctx?.scopedSlots?.default?.() }
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    )
  }
}
</script>
