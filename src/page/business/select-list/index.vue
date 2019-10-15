<template>
  <div>
    <Select v-model="formItem[dicProp]"
      ref="selectRef"
      :class="classes"
      :multiple="multiple"
      class="uit-select-list"
      :label-in-value="isShowLabel"
      :placeholder="placeholder"
      :filterable="filterable"
      :disabled="disabled"
      :clearable="clearable"
      :uitClass="$attrs.uitClass"
      @on-change="checkOption">
      <Option :value="item[map.value]"
        v-for="(item, index) in dicDatas"
        :key="index"> {{item[map.label]}} </Option>
    </Select>
  </div>
</template>

<script>
export default {
  props: {
    formItem: { //存放数据的form对象
      type: Object,
      default () {
        return {}
      }
    },
    classes: { //自定义的class
      type: String,
      default: ''
    },
    dicProp: { //form对象内对应的字段
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择适合业务条线'
    },
    url: { //请求地址
      type: String,
      default: 'api-basic/workbench/dicttype/findDictList'
    },
    isLinkage: { //是否一进入页面就请求数据
      type: Boolean,
      default: true
    },
    map: { //映射对象  name为数据中存放对象的数组名字、label为select的显示（label）对应的字段名、value为select的value值对应的字段名
      type: Object,
      default () {
        return {}
      }
    },
    data: { //请求的data参数
      type: Object,
      default () {
        return {}
      }
    },
    filterable: { //是否开启搜索功能 true开启  false不开启  默认不开启
      type: Boolean,
      default: false
    },
    clearable: { //是否开启清空功能 true开启  false不开启  默认不开启
      type: Boolean,
      default: false
    },
    isShowLabel: { //选择时是否返回label属性  true开启  false不开启  默认不开启
      type: Boolean,
      default: false
    },
    disabled: { //是否禁用
      type: Boolean,
      default: false
    },
    multiple: { //是否多选
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dicDatas: [],
      alreadySelect: ''
    }
  },
  inject: {
    handleClick: {
      default () {
        /*eslint-disable*/
        return new Function
      }
    }
  },
  watch: {
    isLinkage () {
      this.getDictionary()
    }
  },
  created () {
    if (this.isLinkage) {
      this.getDictionary()
    }
    this.alreadySelect = this.formItem[this.dicProp]
  },
  activated () {
    if (this.isLinkage) {
      this.getDictionary()
    }
    this.alreadySelect = this.formItem[this.dicProp]
  },
  deactivated () {
    this.clearOption()
  },
  methods: {
    //获取数据字典信息
    getDictionary (code, params) {
      let a
      if (params) {
        a = params
      } else {
        if (code) {
          for (let i in this.data) {
            this.data[i] = code
          }
          a = this.data
        } else {
          a = this.data
        }
      }
      this.$ajax({
        url: this.url,
        method: 'get',
        data: a
      }).then(res => {
        res.data.data.forEach(item => {
          if (Array.isArray(item[this.map.name])) {
            if (item[this.map.name] && item[this.map.name]) {
              this.dicDatas = item[this.map.name]
            }
          } else {
            this.dicDatas = res.data.data
          }
        })
      })
    },
    //清空选项
    clearOption () {
      this.$refs.selectRef.clearSingleSelect()
      if (!this.isLinkage) {
        this.dicDatas = []
      }
    },
    checkOption (val) {
      this.$emit('on-change', val)
      //inject注入
      this.handleClick(val)
    }
  }
}
</script>

<style>
</style>
