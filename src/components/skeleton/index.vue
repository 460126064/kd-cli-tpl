<template>
  <div>
    <div class="iv-skeleton-item">
      <Row
        :key="$index"
        v-for="(item, $index) in list">
        <Col
          :key="$index"
          v-for="(i, $index) in computedParagraph.row"
          :span="computedParagraph.width[$index]">
          <div
            :style="{height: itemHeight}"
            class="iv-skeleton-color iv-m-r-12 iv-m-b-12"></div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
const defaultParagraph = {
  rows: 4,
  width: [4, 8, 8, 4]
}
const defaultAvata = {
  size: 'small',
  shape: 'circle'
}
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: [Boolean, Object],
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    paragraph: {
      type: [Boolean, Object],
      default: true
    }
  },
  created () {
    this.initAvatar()
    this.initParagraph()
  },
  computed: {
    itemHeight () {
      //暂未实现计算高度
      return `15px`
    },
    computedAvatar () {
      if (typeof this.avatar === 'boolean') return this.defaultParagraph
      return this.avatar
    },
    computedParagraph () {
      if (typeof this.paragraph === 'boolean') return this.defaultAvata
      return this.paragraph
    },
    list () {
      let list = [[8, 16], [16, 8], [6, 8, 10]]
      let res = []
      for (let i = 0; i < this.repeat; i++) res.push(...list)
      return res
    }
  },
  methods: {
    initAvatar () {
    }
  }
}
</script>
<style lang="scss" scoped>
  .iv-skeleton-item {
    .iv-skeleton-color {
      background: #ccc;
    }
  }
</style>
