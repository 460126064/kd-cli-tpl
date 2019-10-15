<template>
  <div class="iv-remote-wrapper">
    <Select
        v-model="formItem[name]"
        :multiple="multiple ? true : false"
        filterable
        remote
        ref="Select"
        :remote-method="remoteMethod"
        @on-change="onChang"
        :loading="loading">
        <Option
          v-for="(option, index) in options"
          :value="option.value"
          :key="index">{{option.label}}</Option>
    </Select>
  </div>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    map: {
      type: Object,
      default () {
        return {}
      }
    },
    formItem: {
      type: Object,
      default () {
        return {}
      }
    },
    queryKey: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default () {
        return {}
      }
    },
    name: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loading: false,
      options: []
    }
  },
  created () {
    this.tempAddId = []
    this.remoteMethod(true)
  },
  inject: {
    onSearchChange: {
      default () {
        /*eslint-disable*/
        return new Function
      }
    }
  },
  methods: {
    remoteMethod (query) {
      this.loading = true
      this.addList = []
      if (query) {
        let isBoolean = typeof query === 'boolean'
        this.$ajax({
          url: this.url,
          method: 'GET',
          data: {
            ...this.params,
            [this.queryKey]: isBoolean ? '' : query
          }
        }).then((res) => {
          this.loading = false
          let list = res.data.data.map(item => {
            return {
              label: item[this.map.label],
              value: item[this.map.value]
            }
          })
          if (isBoolean) {
            this.options = list
            return
          }
          this.options = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1)
          //匹配不到，我们要新增
          if (!this.options.length) {
            let addTag = {
              label: query,
              value: query
            }
            this.options = [addTag]
            this.addList.push(addTag)
          }
        })
        return
      }
      this.loading = false
      this.options = []
    },
    onChang (item) {
      this.$emit('on-change', {
        addList: this.addList.slice(this.addList.length - 1),
        current: item,
        setAddId: (item, id) => {
          let queue = this.$refs.Select.values
          let idx = queue.findIndex(cur => cur.value === item)
          queue[idx] = {
            value: id,
            label: (queue[idx] || {}).label
          }
          this.$refs.Select.values = Object.assign([], queue)
          this.$refs.Select.values[idx] = Object.assign({}, queue[idx], {
            _s: Math.random()
          })
          //同步更新optionList，防止重复点击
          this.options = this.options.map(opt => {
            if (opt.label === item) {
              return {
                label: opt.label,
                value: id
              }
            }
            return opt
          })
          this.addList.length = 0
        }
      })
      //触发inject
      this.onSearchChange(item, this.$attrs.item)
    }
  }
}
</script>
<style lang="scss">
.iv-remote-wrapper{
  .ivu-select-input{
    height: 32px !important;
    line-height: 32px !important;
  }
}
</style>
