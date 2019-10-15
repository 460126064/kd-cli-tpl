<template>
  <div class="iv-edit">
    <div class="iv-title" v-if="!isEdit">
      <span class="iv-fs-16 iv-fw-b">
        {{ node.title || node[privateConfig.name] }}
      </span>
      <template v-if="!node.noEdit">
        <IconFont
          v-if="headerFistEdit ? true : node.nodeKey"
          @click="changeEdit"
          class="iv-m-l-8 iv-main-hover-color iv-pointer iv-main-color"
          type="edit"/>
        <DeletePoptip :title="config.deleteTitle || '你确定删除此条数据吗？'" ref="deletePoptip" @on-ok="changeDelete" v-if="privateConfig.showDelete">
          <IconFont
            class="iv-m-l-8 iv-main-hover-color iv-pointer iv-main-color"
            type="delete1"/>
        </DeletePoptip>
      </template>
      <div
        v-if="config.showAdd"
        class="iv-pull-right iv-operate-wrapper">
        <span
          @click="handlerAdd"
          class="iv-operate-item iv-main-color iv-hover-color iv-pointer">
          {{ config.addBtnText || '新建' }}
        </span>
      </div>
    </div>
    <Row v-else class="iv-temp">
      <Col
        :xs="24"
        :md="8"
        :lg="8"
        :key="item.label"
        class="iv-edit-container"
        v-for="item in privateConfig.list">
        <template v-if="isArray(item)">
          <Row :gutter="16">
            <Col v-for="el in item" :key="el.label" :span="24 / item.length">
              <label
                class="iv-pull-left iv-fs-14 iv-m-r-12 iv-label"
                v-html="el.label"></label>
              <div
                class="iv-edit-wrapper">
                <Input
                  v-model="formItem[el.name]"
                  :placeholder="el.placeholder || `请输入${el.label}`"
                  :class="[el.uitClass || `uit-edit-input-${el.name}`, errorClass[el.name] ? 'iv-error' : '']"
                  v-bind="el.props || {}"
                  v-if="el.type === 'Input'"/>
                <Select
                  ref="singleSelect"
                  v-model="formItem[el.name]"
                  :class="[el.uitClass || `uit-edit-select-${el.name}`, errorClass[el.name] ? 'iv-error' : '']"
                  :uitClass="el.uitClass || `uit-edit-selectoption-${el.name}`"
                  :placeholder="el.placeholder || `请选择${el.label}`"
                  v-bind="el.props || {}"
                  @on-change="e => onSearchChange(e, el)"
                  v-if="el.type === 'Select'">
                  <Option
                    v-for="opt in el.optionList"
                    :value="opt.value"
                    :key="opt.value">{{ opt.label }}
                  </Option>
                </Select>
                <Checkbox
                  class="iv-checkbox-wrapper"
                  v-model="formItem[el.name]"
                  :class="[el.uitClass || `uit-search-input-${el.name}`, errorClass[el.name] ? 'iv-error' : '']"
                  v-bind="el.props || {}"
                  v-if="el.type === 'Checkbox'"/>
                <!--  非静态下拉框（通过Ajax请求下拉框） -->
                <SelectList
                  ref="remoteSelect"
                  v-if="el.type === 'RemoteSelect'"
                  :uitClass="el.uitClass || `uit-search-selectoption-${el.name}`"
                  :classes="[`uit-search-select-${el.name}`, errorClass[el.name] ? 'iv-error' : '']"
                  :el="formItem"
                  :formItem="formItem[el.name] ? formItem[el.name] : (formItem[el.name] = {[el.name]: ''})"
                  v-bind="el.props || {}"/>
                <Expand v-if="item.type === 'render'" :render="item.render" :item="item"></Expand>
              </div>
            </Col>
          </Row>
        </template>
        <template v-else>
          <label
            class="iv-pull-left iv-fs-14 iv-m-r-12 iv-label"
            v-html="item.label"></label>
          <div
            class="iv-edit-wrapper">
            <Input
              v-model="formItem[item.name]"
              :placeholder="item.placeholder || `请输入${item.label}`"
              :class="[item.uitClass || `uit-edit-input-${item.name}`, errorClass[item.name] ? 'iv-error' : '']"
              v-bind="item.props || {}"
              v-if="item.type === 'Input'"/>
            <Select
              ref="singleSelect"
              v-model="formItem[item.name]"
              :class="[item.uitClass || `uit-edit-select-${item.name}`, errorClass[item.name] ? 'iv-error' : '']"
              :uitClass="item.uitClass || `uit-edit-selectoption-${item.name}`"
              :placeholder="item.placeholder || `请选择${item.label}`"
              v-bind="item.props || {}"
              @on-change="e => onSearchChange(e, item)"
              v-if="item.type === 'Select'">
              <Option
                v-for="opt in item.optionList"
                :value="opt.value"
                :key="opt.value">{{ opt.label }}
              </Option>
            </Select>
            <Checkbox
              class="iv-checkbox-wrapper"
              v-model="formItem[item.name]"
              :class="[item.uitClass || `uit-search-input-${item.name}`, errorClass[item.name] ? 'iv-error' : '']"
              v-bind="item.props || {}"
              v-if="item.type === 'Checkbox'"/>
            <!--  非静态下拉框（通过Ajax请求下拉框） -->
            <SelectList
              ref="remoteSelect"
              v-if="item.type === 'RemoteSelect'"
              :uitClass="item.uitClass || `uit-search-selectoption-${item.name}`"
              :classes="[`uit-search-select-${item.name}`, errorClass[item.name] ? 'iv-error' : '']"
              :item="formItem"
              :formItem="formItem[item.name] ? formItem[item.name] : (formItem[item.name] = {[item.name]: ''})"
              v-bind="item.props || {}"/>
            <Expand v-if="item.type === 'render'" :render="item.render" :item="{item, formItem}"></Expand>
          </div>
        </template>
      </Col>
      <Col
        class="iv-text-right iv-edit-container"
        :push="pushCol"
        :xs="24"
        :md="8"
        :lg="8">
        <slot v-if="btnSlotPos === 'left'" name="btn"></slot>
        <span @click="save" class="uit-save-btn iv-btn iv-fs-14 iv-main-color iv-main-hover-color iv-pointer">
          保存
        </span>
        <span @click="cancel" class="uit-save-btn iv-btn iv-fs-14 iv-main-color iv-main-hover-color iv-pointer">
          取消
        </span>
        <slot v-if="btnSlotPos === 'right'" name="btn"></slot>
      </Col>
    </Row>
  </div>
</template>
<script>
import SelectList from '@/page/business/select-list'
import IconFont from 'components/iconfont'
import validateInline from '@/mixins/validate-inline'
import DeletePoptip from 'components/poptip'
import Expand from 'components/expand'

export default {
  mixins: [validateInline],
  props: {
    config: {
      type: Object,
      default () {
        return {
          list: []
        }
      }
    },
    btnSlotPos: {
      type: String,
      default: 'left'
    },
    headerUrl: {
      type: String,
      default: ''
    },
    headerFistEdit: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isEdit: false,
      formItem: {},
      node: {}
    }
  },
  computed: {
    pushCol () {
      return 16 - this.config.list.length % 3 * 8
    },
    errorClass () {
      return this.formItem.errorQueue || {}
    }
  },
  components: {
    SelectList,
    DeletePoptip,
    Expand,
    IconFont
  },
  created () {
    this.isArray = Array.isArray
    this.rules = this.config.rules
    this.privateConfig = this.config
  },
  watch: {
    config (config) {
      this.rules = config.rules
      this.privateConfig = config
    }
  },
  inject: {
    changeNodeSave: {
      default () {
        return function () {
          /*eslint-disable*/
            return new Promise(function () {
            })
          }
        }
      },
      changeNodeDel: {
        default() {
          return function () {
            /*eslint-disable*/
            return new Promise(function () {
            })
          }
        }
      }
    },
    methods: {
      handlerAdd () {
        this.changeEdit()
        this.formItem = {
          isAdd: true
        }
      },
      setNode(node) {
        if(node.noEdit) {
          this.isEdit = false
        }
        this.node = node
        this.formItem = {...(node.data || node), isAdd: false}
      },
      setConfig(config) {
        this.rules = config.rules
        this.privateConfig = config
      },
      save() {
        const item = this.formItem
        this.validateInline(item).then((res) => {
          this.changeNodeSave(item).then((data) => {
            // 更新数据
            this.node = {
              ...this.node,
              ...data
            }
            let titleKey = data.titleKey
            delete data.titleKey
            this.$ajax({
              url: this.headerUrl,
              method: this.formItem.isAdd ? 'POST': 'PUT',
              data: data
            }).then((res) => {
              let message = this.formItem.isAdd ? '添加成功': '编辑成功'
              this.showMessage(res, message).then(type => {
                if (type === 'success') {
                  this.isEdit = false
                  titleKey && (this.node.title = data[titleKey])
                  this.config.init && this.config.init()
                }
              })
            })
          })
        })
      },
      cancel() {
        this.isEdit = false
        this.formItem = {...(this.node.data || this.node)}
      },
      showMessage(res, msg) {
        let msgType = 'success'
        if (res.code === '5000' && res.term.state === false) {
          msg = this.tips.list.codes[res.term.code]
          msgType = 'error'
        } else if (res.data && res.data.term.state === false) {
          msg = this.tips.list.codes[res.data.term.code]
          msgType = 'error'
        }
        this.$Message[msgType](msg, 1000)
        return Promise.resolve(msgType)
      },
      changeEdit() {
        this.isEdit = true
      },
      changeDelete() {
        this.changeNodeDel(this.formItem).then((data) => {
          this.$ajax({
            url: this.headerUrl,
            method: 'delete',
            data: data
          }).then((res) => {
            this.$Message.success('删除成功')
            this.$refs.deletePoptip.hide()
            this.config.init && this.config.init('delete')
            this.$emit('on-node-delete')
          })
        })
      },
      onSearchChange(v) {
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'variable/variable.scss';

  /deep/ .ivu-row {
    min-width: 0 !important;
  }

  .iv-edit {
    padding: 0 $three-double;
    border-bottom: 1px solid $iv-border-color;
    margin-bottom: $three-double;
  }

  .iv-title {
    height: 32px;
    line-height: 32px;
    margin-bottom: $three-double;
  }

  .iv-edit-container {
    height: 32px;
    line-height: 32px;
    padding-right: $three-double;
    margin-bottom: $three-double;

    &:nth-child(3n) {
      .iv-edit-wrapper {
        padding-right: 0;
      }
    }

    .iv-edit-wrapper {
      overflow: hidden;
    }

    .iv-label {
      margin-top: 5px;
    }

    .iv-checkbox-wrapper {
      height: 24px;;
    }
  }

  .iv-error {
    border: 1px solid red;
    border-radius: 4px;
  }

  .iv-btn {
    padding-right: $one-double;
    margin-right: $one-double;
    border-right: 1px solid $iv-border-color;

    &:last-child {
      padding-right: 0;
      margin-right: 0;
      border-right: none;
    }
  }
</style>
<style lang="scss">
  .iv-edit-wrapper {
    .ivu-date-picker {
      width: 100%;
    }
  }
</style>
