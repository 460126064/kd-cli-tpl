<template>
  <FormLayout>
    <Form
      ref="Form"
      :rules="$attrs.rules"
      :model="model">
      <ReadonlyFormLayout
        v-bind="$attrs"
        :readOnly="inReadOnly">
        <Row>
          <!-- 区分图片类型快级区域 -->
          <Col
            :lg="getCol(item)"
            :md="getCol(item)"
            :sm="getCol(item)"
            :key="$index"
            v-for="(item, $index) in layoutList">
              <Row v-if="Array.isArray(item)">
                <!-- 循环体积 -->
                <Col
                  :key="initRules(child, $$index)"
                  v-for="(child, $$index) in item"
                  :lg='24 / Math.ceil(item.length)'
                  :md='24 / Math.ceil(item.length)'
                  :sm='24 / Math.ceil(item.length)'>
                    <slot name="group" :item="child">
                      <FormItem
                        class="iv-datepicker-fill"
                        :prop="child.key"
                        :label="child.displayName || child.title">
                        <Select
                          v-model="model[child.key]"
                          :disabled="child.readOnly === void 0 ? inReadOnly : child.readOnly"
                          v-bind="item.props"
                          v-if="child.type === 'Select'">
                            <Option
                              :key="$$$index"
                              :value="opt.value"
                              v-for="(opt, $$$index) in child.optionList">{{opt.label}}</Option>
                        </Select>
                        <DatePicker
                          class="iv-datepicker-form"
                          :readonly="child.readOnly === void 0 ? inReadOnly : child.readOnly"
                          :disabled="item.readOnly === void 0 ? inReadOnly : item.readOnly"
                          v-model="model[child.key]"
                          v-bind="item.props"
                          v-else-if="child.type === 'DatePicker'"></DatePicker>
                        <Input
                          :disabled="child.readOnly === void 0 ? inReadOnly : child.readOnly"
                          v-model="model[child.key]"
                          v-bind="item.props"
                          v-else />
                      </FormItem>
                    </slot>
                  </Col>
              </Row>
              <slot v-else
              :keys="initRules(item, $index)"
              :item="item">
                <ImgUpload
                  v-if="item.key === 'photo'"
                  v-bind="item.props" />
                <FormItem
                  v-else
                  class="iv-datepicker-fill"
                  :prop="item.key"
                  :label="item.displayName || item.title">
                  <Select
                    :disabled="item.readOnly === void 0 ? inReadOnly : item.readOnly"
                    v-model="model[item.key]"
                    v-bind="item.props"
                    v-if="item.type === 'Select'">
                      <Option
                        :key="$$$index"
                        :value="opt.value"
                        v-for="(opt, $$$index) in item.optionList">{{opt.label}}</Option>
                    </Select>
                  <DatePicker
                    :readonly="item.readOnly === void 0 ? inReadOnly : item.readOnly"
                    :disabled="item.readOnly === void 0 ? inReadOnly : item.readOnly"
                    v-model="model[item.key]"
                    class="iv-datepicker-form"
                    v-bind="item.props"
                    v-else-if="item.type === 'DatePicker'"></DatePicker>
                  <Input
                    :disabled="item.readOnly === void 0 ? inReadOnly : item.readOnly"
                    v-model="model[item.key]"
                    v-bind="item.props"
                    v-else />
                </FormItem>
              </slot>
          </Col>
        </Row>
      </ReadonlyFormLayout>
    </Form>
  </FormLayout>
</template>
<script>
import { last } from 'lodash'
import ImgUpload from '@/page/business/img-upload'
import { idCard, email, phoneNumber } from '@/utils/form-validate-common'
import FormLayout from '@/components/layout/form-layout'
import ReadonlyFormLayout from './readonly-from-layout'
//分组入栈
class Stacks {
  stack = []
  //入栈，添加出栈规则
  set (arr, index, condition) {
    this.stack.push({
      source: arr,
      condition,
      index
    })
  }
  //根据规则出栈
  get () {
    let item = last(this.stack)
    while (item && item.condition(item.source)) {
      this.stack.pop()
      item = last(this.stack)
    }
    return item
  }
}
//校验规则字典
const validateMap = {
  required ({val = true, isChange}) {
    return {
      required: val,
      message: '此项必填',
      trigger: isChange ? 'change' : 'blur'
    }
  },
  max ({val = 100, isChange}) {
    return {
      max: val,
      message: `超出${val}字符`,
      trigger: isChange ? 'change' : 'blur'
    }
  },
  min ({val = 10, isChange}) {
    return {
      min: val,
      message: `不得少于${val}个字符`,
      trigger: isChange ? 'change' : 'blur'
    }
  },
  id () {
    return idCard
  },
  email () {
    return email
  },
  phoneNumber () {
    return phoneNumber
  }
}
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    columnsForm: {
      type: Object,
      default () {
        return {}
      }
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    layoutList () {
      // return this.splitGroup(this.list)
      return this.list
    }
  },
  data () {
    return {
      inReadOnly: this.readOnly
    }
  },
  components: {
    ImgUpload,
    FormLayout,
    ReadonlyFormLayout
  },
  watch: {
    readOnly (val) {
      this.inReadOnly = val
    }
  },
  methods: {
    splitGroup (list) {
      //计算data
      let res = [], stacks = new Stacks()
      list.forEach((item, index) => {
        let idx = res.length % 3, isSurplus
        // item.type = (this.columnsForm[item.key] || {}).type
        // item.optionList = (this.columnsForm[item.key] || {}).optionList
        if (item.key === 'photo') {
          let isIndex = idx === 0
          let start = isIndex ? res.length : res.length - idx
          let end = isIndex ? start : res.length - 1
          res.push(item)
          //添加回溯规则
          switch (idx) {
            case 0:
              stacks.set([], start + 1, list => list.length === 4)
              break
            case 1:
              res[start] = [res[start]]
              stacks.set([], res.length, list => list.length === 2)
              stacks.set(res[start], start, list => list.length === 2)
              break
            case 2:
              res[start] = [res[start], res[end]]
              res.splice(end, 1)
              stacks.set(res[start], start, list => list.length === 4)
              break
          }
          return
        }
        isSurplus = stacks.get()
        if (isSurplus) {
          let {source, index} = isSurplus
          source.push(item)
          res[index] = source
          return
        }
        res.push(item)
      })
      return res
    },
    getCol (item) {
      if (Array.isArray(item)) {
        return ~~(24 / item.length)
      }
      return 8
    },
    initRules (item, $index) {
      let { rules } = this.$attrs
      let validate = item.rules
      let itemRule = rules[item.key] || (rules[item.key] = [])
      //循环遍历
      validate.forEach(v => {
        try {
          const isChange = item.type === 'Select' || item.type === 'Radio' || item.type === 'DatePicker'
          validateMap[v] && itemRule.push(validateMap[v]({isChange}))
        } catch (err) {
          console.error('表单校验规则不存在')
        }
      })
      //为每一个选项添加rules
      return item.attrCode
    },
    validate () {
      return this.$methods('Form', 'validate')
    },
    resetFields () {
      return this.$methods('Form', 'resetFields')
    },
    setReadOnly (val) {
      this.inReadOnly = val
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
