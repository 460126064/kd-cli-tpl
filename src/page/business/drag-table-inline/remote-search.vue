<template>
  <Select
    :value="value"
    :clearable="clearable"
    :filterable="filterable"
    @on-change="onChange">
    <Option
      v-for="item in opl"
      :key="item.value"
      :value="item.value">
      {{ item.label }}
    </Option>
  </Select>
</template>

<script>
export default {
  name: 'remote-search',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    searchOptionList: {
      type: Array,
      default () {
        return []
      }
    },
    optionList: {
      type: Array,
      default () {
        return []
      }
    },
    props: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      filterable: false,
      opl: []
    }
  },
  created () {
    this.cacheOpl = this.searchOptionList.length ? this.searchOptionList : this.optionList
    this.initOption()
  },
  methods: {
    initOption () {
      if (this.props.url) {
        this.filterable = true
        this.getOpl()
      } else {
        this.opl = this.cacheOpl
      }
    },
    getOpl (v) {
      const {
        url = 'mock/5d91a8244a9da91cd653fbca/dictionaryItemList',
        key,
        params = {},
        map = {
          label: 'name',
          value: 'code'
        }
      } = this.props || {}
      this.$ajax({
        url: url,
        data: Object.assign(params, key ? { [key]: v } : {})
      }).then(({data}) => {
        this.opl = data.data.map(item => {
          this.labelMap = {
            [item[map.label]]: true
          }
          return {
            label: item[map.label],
            value: item[map.value]
          }
        })
      })
    },
    onChange (...args) {
      this.$emit('on-change', ...args)
    }
  },
  components: {}
}
</script>
