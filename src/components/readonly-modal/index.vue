<template>
  <Row class="iv-col">
    <Col
    :key="$index"
    v-for="(item, $index) in list"
    :lg="12"
    :md="12"
    :sm="24">
      <span>{{item[map.label]}}: {{item[map.value]}}</span>
    </Col>
  </Row>
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
    map: {
      type: Object,
      default () {
        return {
          label: 'name',
          value: 'code'
        }
      }
    }
  },
  created () {
  },
  methods: {
    confrim () {
      this.$emit('on-ok', this.$refs.Poptip)
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-col {
  margin: $three-double;
}
</style>
