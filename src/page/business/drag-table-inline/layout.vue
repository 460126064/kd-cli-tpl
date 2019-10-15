<script>
export default {
  props: {},
  functional: true,
  render (h, ctx) {
    return (
      <div class="iv-com-container-full">
        <div class="iv-com-layout">
          <div class="iv-com-fill">
            {ctx.scopedSlots && ctx.scopedSlots.default && ctx.scopedSlots.default()}
          </div>
        </div>
      </div>
    )
  }
}
</script>
