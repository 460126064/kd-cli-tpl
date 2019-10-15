<template>
    <span v-if="inIsEdit || types">
      <Select
        v-if="showType === 'select'"
        v-model="item[type]"
        size="small"
        :class="[`uit-${type}-list`, errorClass ? 'iv-error' : '']"
        @on-change="onBlur">
        <Option v-for="i in inOptionList" :value="i.value" :key="i.value">{{ i.label }}</Option>
      </Select>
      <DatePicker
        v-else-if="showType === 'datePicker'"
        v-model="item[type]"
        :type="props.type || daterange"
        :options="props.options"
        :placeholder="props.placeholder || '请选择'"
        v-bind="props"></DatePicker>
      <SelectTree
        :props="props"
        :optionData="inOptionList"
        v-else-if="showType === 'searchTree'"></SelectTree>
      <Input
        v-else-if="showType === 'inputNumber'"
        :class="[`uit-${type}-list`, errorClass ? 'iv-error' : '']"
        v-model.trim.number="item[type]" />
      <Input
        v-else
        ref="input"
        v-model.trim="item[type]"
        :key="item.forceInput ? item.forceInput : ''"
        @on-blur="onBlur"
        :class="[`uit-${type}-list`, errorClass ? 'iv-error' : '']">
        <span
          v-if="prepend.show && prepend.show(item)"
          slot="prepend">{{prepend.text(item)}}</span>
      </Input>
    </span>
    <div v-else v-transfer-height @click="changeEdit">
      {{textShow()}}
    </div>
</template>
<script>

import SelectList from '@/page/business/select-list'
import SelectTree from '@/components/select-tree'

export default {
  props: {
    //当前编辑元数据类型
    type: {
      type: String,
      default: 'id'
    },
    //当前编辑元数据
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    //当前编辑索引
    index: {
      type: Number,
      required: true,
      default: 0
    },
    //是否可编辑状态
    isEdit: {
      type: [Boolean, Promise],
      default: false
    },
    //单行可编辑
    singelEdit: {
      type: Boolean,
      default: false
    },
    isFireBlur: {
      type: Boolean,
      default: false
    },
    showType: {
      type: String,
      default: 'input'
    },
    props: {
      type: Object,
      default () {
        return {}
      }
    },
    optionList: {
      type: Array,
      default () {
        return []
      }
    },
    prepend: {
      type: Object,
      default () {
        return {}
      }
    },
    textRender: {
      type: Function
    },
    handler: {
      type: Function
    }
  },
  inject: {
    setSortIndex: {
      default () {
        return function () {}
      }
    }
  },
  data () {
    return {
      types: false,
      inOptionList: this.optionList,
      inIsEdit: typeof this.isEdit === 'boolean' ? this.isEdit : false
    }
  },
  watch: {
    optionList (newVal) {
      this.inOptionList = newVal
    },
    isEdit (val) {
      this.getIsEdit()
    }
  },
  computed: {
    errorClass () {
      return this.item.errorQueue && this.item.errorQueue[this.type]
    }
  },
  directives: {
    'transfer-height': {
      inserted (el) {
        Promise.resolve()
          .then(() => {
            if (el.textContent && !(/^\s+$/.test(el.textContent))) return
            let parent = el.parentElement
            let h
            while (parent) {
              if (parent.nodeName.toLowerCase() === 'td') break
              parent = parent.parentElement
            }
            h = parseInt(window.getComputedStyle ? window.getComputedStyle(parent).height : parent.getCurrentStyle('height'))
            el.style.height = `${h}px`
          })
      }
    }
  },
  components: {
    SelectList,
    SelectTree
  },
  created () {
    if (this.props.url && this.props.data && this.props.map) {
      this.$emit('on-remote', {
        request: this.getRemoteSelect,
        vm: this
      })
    }
    this.getIsEdit()
  },
  methods: {
    getIsEdit () {
      //获取thenable对象
      if (typeof this.isEdit === 'object' && typeof this.isEdit.then === 'function') {
        this.isEdit.then((res) => {
          this.inIsEdit = res
        })
        return
      }
      this.inIsEdit = this.isEdit
    },
    onBlur () {
      this.isFireBlur && this.setSortIndex(this.index, this.item[this.type], this.item)
      this.handler && this.handler('on-change', this.item, ...arguments)
    },
    changeEdit () {
      this.singelEdit && (this.types = true)
      if (this.type !== '_sort') return
      this.$set(this.item, 'sort', true)
    },
    getRemoteSelect () {
      return this.$ajax({
        url: this.props.url,
        data: this.props.data,
        method: 'GET'
      }).then(({data}) => {
        return data.data.map(item => {
          return {
            label: item[this.props.map.label],
            value: item[this.props.map.value]
          }
        })
      })
    },
    textShow () {
      let text = this.item[this.type]
      if (this.textRender) return this.textRender(this.item)
      if (this.showType === 'select' || this.showType === 'searchTree') {
        this.inOptionList.forEach(element => {
          if (element.value == text) {
            text = element.label
          }
        })
      }
      return text
    },
    isNonEmptyObject (obj) {
      try {
        for (let i in obj) {
          if (obj.hasOwnProperty(i)) return true
        }
      } catch (err) {
        return false
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
  .iv-error {
    border: 1px solid red;
    border-radius: 4px;
  }
</style>
