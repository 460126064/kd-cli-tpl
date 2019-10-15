<template>
  <div>
    <Row class="iv-temp">
      <Col
        :xs="24"
        :md="8"
        :lg="8"
        :key="item.label"
        class="iv-search-container iv-symbol-pt16 iv-symbol-pb16 iv-symbol-pr16"
        :class="spread ? '' : $index <= 1 ? '' : 'iv-hide'"
        v-cache="item"
        v-for="(item, $index) in list">
        <label
          class="iv-pull-left iv-fs-14 iv-m-r-12 iv-label"
          v-html="item.label"></label>
        <div
          class="iv-search-wrapper">
          <Input
          v-model="item[item.name]"
          :placeholder="item.placeholder || `请输入${item.label}`"
          :class="item.uitClass || `uit-search-input-${item.name}`"
          @on-change="inputChange"
          @on-enter="search"
          v-bind="item.props || {}"
          v-if="item.type === 'Input'" />
          <Select
           ref="singleSelect"
           v-model="item[item.name]"
           :class="item.uitClass || `uit-search-select-${item.name}`"
           :uitClass="item.uitClass || `uit-search-selectoption-${item.name}`"
           :placeholder="item.placeholder || `请选择${item.label}`"
           v-bind="item.props || {}"
           @on-change="e => onSearchChange(e, item)"
           clearable
           v-if="item.type === 'Select'">
             <Option
              v-for="opt in item.optionList"
              :value="opt.value"
              :key="opt.value">{{ opt.label }}</Option>
           </Select>
          <DatePicker
           v-model="item[item.name]"
           :options="datePickerOps(item, $index)"
           :type="item.type === 'DatePicker' && item.format ? item.format : 'date'"
           :uitClass="item.uitClass || `uit-search-selectoption-${item.name}`"
           :placeholder="item.placeholder || `请选择${item.label}`"
           :class="item.uitClass || `uit-search-date-${item.name}`"
           v-bind="item.props || {}"
           @on-change="inputChange(item, $index)"
           v-if="item.type === 'DatePicker'"></DatePicker>
          <Checkbox
            class="iv-checkbox-wrapper"
            v-model="item[item.name]"
            :class="item.uitClass || `uit-search-input-${item.name}`"
            @on-change="inputChange"
            v-bind="item.props || {}"
            v-if="item.type === 'Checkbox'" />
          <!--  非静态下拉框（通过Ajax请求下拉框） -->
          <SelectList
           ref="remoteSelect"
           v-if="item.type === 'RemoteSelect'"
           :uitClass="item.uitClass || `uit-search-selectoption-${item.name}`"
           :classes="`uit-search-select-${item.name}`"
           :clearable="true"
           :item="item"
           :formItem="item[item.name] ? item[item.name] : (item[item.name] = {[item.name]: ''})"
           v-bind="item.props || {}" />
        </div>
      </Col>
      <Col
        class="iv-text-right iv-search-container"
        :push="pushCol"
        :xs="24"
        :md="8"
        :lg="8">
        <slot v-if="btnSlotPos === 'left'" name="btn"></slot>
        <Button type="primary"
          @click="search"
          class="iv-m-r-8 uit-search-list">
          查询
        </Button>
        <Button
          type="ghost"
          @click="search('reset')"
          class="uit-reset-list">
          重置
        </Button>
        <slot v-if="btnSlotPos === 'right'" name="btn"></slot>
        <span
          @click="spreadChange"
          v-if="isShowSpread"
          class="iv-main-color iv-hover-color iv-spread iv-pointer iv-p-l-8 iv-fs-14 uit-spread-list">
          {{spreadText}}
          <Icon
            :type="spreadIcon"></Icon>
        </span>
      </Col>
    </Row>
  </div>
</template>
<script>
import {DatePicker} from 'iview'
import SelectList from '@/page/business/select-list'
import {timeFormat} from '@/utils'
const datePickerOp = function (item, index) {
  if (item.startDate) {
    //记录start值
    this.datePickeStartIndex = index
  }
  if (!item.endDate) return
  return {
    disabledDate: (date) => {
      let startitem = this.list[this.datePickeStartIndex]
      return !startitem[startitem.name] || date < startitem[startitem.name]
    }
  }
}
let getOpts
let resetFlag = true
export default {
  props: {
    isSpread: {
      type: Boolean,
      default: true
    },
    /*
     * @description type为收起展开状态
     * type {String} 1、收起 2、展开
     */
    spreadType: {
      type: Number,
      default: 1
    },
    list: {
      type: Array,
      default () {
        return []
      }
    },
    immediate: {
      type: Boolean,
      default: true
    },
    btnSlotPos: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      spread: (this.isSpread && this.spreadType === 2) || !this.isSpread,
      isShowSpread: this.isSpread && this.list.length >= 3,
      type: this.spreadType
    }
  },
  computed: {
    pushCol () {
      return this.isShowSpread && this.type === 1 ? 0 : (16 - this.list.length % 3 * 8)
    },
    spreadText () {
      return this.spread ? '收起' : '展开'
    },
    spreadIcon () {
      return this.spread ? 'arrow-up-b' : 'arrow-down-b'
    }
  },
  watch: {
    list (newVal) {
      this.isShowSpread = this.isSpread && newVal.length >= 3
      this.inputChange()
    }
  },
  components: {
    DatePicker,
    SelectList
  },
  directives: {
    cache: {
      bind (el, {value}) {
        if (!resetFlag || value.type === 'RemoteSelect') return
        value.origin = value[value.name]
      }
    }
  },
  created () {
    getOpts = datePickerOp.bind(this)
  },
  mounted () {
    this.resetFlag = false
    this.immediate && this.search()
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
    transformData (isReset) {
      let data = {}
      this.list.forEach(item => {
        if (isReset) {
          switch (item.type) {
            case 'Select':
              data[item.name] = item[item.name] = item.origin || ''
              !item.origin && this.selectReset('singleSelect', 'clearSingleSelect')
              break
            case 'Checkbox':
              data[item.name] = item[item.name] = item.default
              break
            case 'RemoteSelect':
              data[item.name] = item[item.name][item.name] = ''
              !item.origin && this.selectReset('remoteSelect', 'clearOption')
              break
            default:
              data[item.name] = item[item.name] = ''
          }
          return
        }
        switch (item.type) {
          case 'RemoteSelect':
            data[item.name] = item[item.name][item.name]
            break
          case 'DatePicker':
            let val = item[item.name]
            if (Array.isArray(val)) {
              data[item.name] = val.map(current => {
                return timeFormat(current, (item.props || {}).format)
              })
              return
            }
            data[item.name] = timeFormat(item[item.name], (item.props || {}).format)
            break
          default:
            data[item.name] = item[item.name] || ''
        }
      })
      return data
    },
    search (reset) {
      let isReset = typeof reset === 'string' && reset === 'reset'
      this.$emit('on-search', this.transformData(isReset))
      isReset && this.$forceUpdate()
    },
    spreadChange () {
      this.spread = !this.spread
      this.type = this.type === 1 ? 2 : 1
    },
    inputChange (item, index) {
      this.$forceUpdate()
      if (!item) return
      //如果是开始日期选择后，清空结束日期
      if (item.startDate) {
        for (let idx = index + 1, length = this.list.length; idx < length; idx++) {
          let currentItem = this.list[idx]
          if (currentItem.endDate) {
            currentItem[currentItem.name] = ''
            return
          }
        }
      }
    },
    //获取datePicker的options
    datePickerOps (item, index) {
      return getOpts(item, index)
    },
    // 下拉重置
    selectReset (ref, fn) {
      let singleSelect = this.$refs[ref]
      let refs = Array.isArray(singleSelect) ? singleSelect : [singleSelect]
      refs.forEach(item => item[fn] && item[fn]())
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-search-container {
  &:nth-child(3n) {
    .iv-search-wrapper {
      padding-right: 0;
    }
  }
  .iv-search-wrapper {
    overflow: hidden;
  }
  .iv-label {
    margin-top: 2px;
  }
  .iv-checkbox-wrapper {
    height: 24px;;
  }
}
.iv-spread {
  position: relative;
  top: 2px;
}
.iv-hide {
  display: none;
}
</style>
// 设置搜索布局组件
<style lang="scss">
.iv-search-wrapper {
  .ivu-date-picker {
    width: 100%;
  }
}
</style>
