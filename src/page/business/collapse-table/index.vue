<template>
  <FormLayout>
    <Collapse
      :value="genArray(treeData[0].children)"
      class="iv-ct-wrapper">
      <Panel
        v-for="(node, idx) in treeData[0].children"
        class="iv-ct-lv1"
        :key="idx"
        :name="`${idx}`">
        <!--      一级title-->
        <span class="iv-fs-14 iv-fw-b">{{ node.title }}</span>
        <Row>
          <Col
            v-for="(col, i) in columns"
            :key="i"
            :span="columns.length > 4 ? (24 / columns.length | 0) : 6">
            <span class="iv-fs-14 iv-fw-b">{{ col.title }}</span>
          </Col>
        </Row>
        <template v-if="isDefChildren(node.children)">
          <div slot="content">
            <Collapse
              :value="genArray(node.children, idx)"
              class="iv-ct-lv2">
              <Panel
                v-for="(el, i) in node.children"
                :key="i"
                :name="`${idx}-${i}`">
                <!--            二级title-->
                <span class="iv-fs-14">{{ el.title }}</span>
                <div slot="content" class="iv-page-wrapper">
                  <div
                    class="iv-page-item"
                    v-for="(page, i) in el.children"
                    :key="i">
                    <!--                三级title-->
                    <span class="iv-fs-14">&nbsp;{{ page.title }}</span>
                  
                    <Row>
                      <Col
                        v-for="(col, colIdx) in columns"
                        :key="colIdx"
                        class="iv-fs-14"
                        :span="columns.length > 4 ? (24 / columns.length | 0) : 6">
                        <!--                    操作区域-->
                        <LoopCheckbox
                          v-if="getType(col, colIdx, i) === 'checkbox'"
                          @on-change="() => {
                            onChange(page, col.key)
                          }"
                          v-model="page[col.key]"></LoopCheckbox>
                        <Radio
                          v-if="getType(col, colIdx, i) === 'radio'"
                          @on-change="onChange(page, col.key, el)"
                          v-model="page[col.key]"></Radio>
                        <Checkbox
                          v-if="getType(col, colIdx, i) === 'allow'"
                          disabled
                          :value="true"></Checkbox>
                        <Checkbox
                          v-if="getType(col, colIdx, i) === 'not-allow'"
                          disabled
                          ></Checkbox>
                        <Icon
                          v-if="getType(col, colIdx, i) === 'disabled'"
                          class="iv-not-allow"
                          size="16"
                          color="#f40"
                          type="close-circled"></Icon>
                        <span
                          v-if="col.more"
                          class="iv-main-color iv-main-hover-color iv-pointer iv-m-l-8"
                          @click="handlerEvent(col)">
                          {{ col.more.text }}
                        <Icon type="ios-arrow-right"></Icon>
                    </span>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>
        </template>
        <template v-else>
          <div slot="content" class="iv-page-wrapper">
            <div
              class="iv-page-item"
              v-for="(page, i) in node.children"
              :key="i">
              <span class="iv-fs-14">&nbsp;{{ page.title }}</span>
      
              <Row>
                <Col
                  v-for="(col, colIdx) in columns"
                  :key="colIdx"
                  class="iv-fs-14"
                  :span="columns.length > 4 ? (24 / columns.length | 0) : 6">
                  <!--                    操作区域-->
                  <LoopCheckbox
                    v-if="getType(col, colIdx, i) === 'checkbox'"
                    @on-change="() => {
                      onChange(page, col.key)
                    }"
                    v-model="page[col.key]"></LoopCheckbox>
                  <Radio
                    v-if="getType(col, colIdx, i) === 'radio'"
                    @on-change="onChange(page, col.key, el)"
                    v-model="page[col.key]"></Radio>
                  <Checkbox
                    v-if="getType(col, colIdx, i) === 'allow'"
                    disabled
                    :value="true"></Checkbox>
                  <Checkbox
                    v-if="getType(col, colIdx, i) === 'not-allow'"
                    disabled
                   ></Checkbox>
                  <Icon
                    v-if="getType(col, colIdx, i) === 'disabled'"
                    class="iv-not-allow"
                    size="16"
                    color="#f40"
                    type="close-circled"></Icon>
                  <span
                    v-if="col.more"
                    class="iv-main-color iv-main-hover-color iv-pointer iv-m-l-8"
                    @click="handlerEvent(col)">
                        {{ col.more.text }}
                      <Icon type="ios-arrow-right"></Icon>
                    </span>
                </Col>
              </Row>
            </div>
          </div>
        </template>
      </Panel>
    </Collapse>
  </FormLayout>
</template>

<script>
import FormLayout from 'components/form-layout'
import LoopCheckbox from './checkbox'
export default {
  name: 'index',
  props: {
    treeData: {
      type: Array,
      default () {
        return [
          {
            'title': '产品',
            'expand': true,
            'children': [
              {
                'title': '系统设置',
                'id': 1,
                'expand': true,
                'children': [
                  {
                    'title': '用户功能管理',
                    'id': 2,
                    'expand': true,
                    'children': [
                      {
                        'title': '列表页',
                        'id': 3,
                        'type': 'list',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false,
                        name: 'check'
                      },
                      {
                        'title': '新增页',
                        'id': 4,
                        'type': 'add',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false,
                        name: 'disabled'
                      },
                      {
                        'title': '修改页',
                        'id': 5,
                        'type': 'add',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false
                      }
                    ]
                  },
                  {
                    'title': '组织机构管理',
                    'children': [
                      {
                        'title': '列表页',
                        'id': 3,
                        'type': 'list',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false,
                        name: 'check'
                      },
                      {
                        'title': '新增页',
                        'id': 4,
                        'type': 'add',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false,
                        name: 'disabled'
                      },
                      {
                        'title': '修改页',
                        'id': 5,
                        'type': 'add',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false
                      }
                    ]
                  },
                  {
                    'title': '业务用户管理',
                    'children': [
                      {
                        'title': '列表页',
                        'id': 3,
                        'type': 'list',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false,
                        name: 'check'
                      },
                      {
                        'title': '新增页',
                        'id': 4,
                        'type': 'add',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false,
                        name: 'disabled'
                      },
                      {
                        'title': '修改页',
                        'id': 5,
                        'type': 'add',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false
                      }
                    ]
                  },
                  {
                    'title': '基准岗位管理',
                    'children': [
                      {
                        'title': '列表页',
                        'id': 3,
                        'type': 'list',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false,
                        name: 'check'
                      },
                      {
                        'title': '新增页',
                        'id': 4,
                        'type': 'add',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false,
                        name: 'disabled'
                      },
                      {
                        'title': '修改页',
                        'id': 5,
                        'type': 'add',
                        'last': false,
                        'user': false,
                        'js': false,
                        'post': false
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    columns: {
      type: Array,
      default () {
        return [
          {
            title: '最终授权',
            key: 'last',
            more: {}
          },
          {
            title: '个人授权',
            key: 'user'
          },
          {
            title: '所属角色',
            key: 'js'
          },
          {
            title: '所属岗位',
            key: 'post'
          }
        ]
      }
    },
    operatorType: {
      type: String,
      default: 'checkbox'
    },
    customOperatorType: {
      type: Function
    }
  },
  created () {
    if (typeof this.customOperatorType === 'function') {
      this.getType = (item, colIdx, rowIdx) => {
        return this.customOperatorType(item, colIdx, rowIdx)
      }
    } else {
      this.getType = () => {
        return this.operatorType
      }
    }
  },
  computed: {
    data () {
      return this.treeData[0] ? Array.isArray(this.treeData[0].children) ? this.treeData[0].children : [] : []
    }
  },
  methods: {
    handlerEvent (item) {
      item.more.handler && item.more.handler(item)
    },
    isDefChildren (arr) {
      return !!(arr[0] && arr[0].children)
    },
    onChange (node, key, el) {
      this.$emit('on-change', this.treeData, node, key, el)
    },
    genArray (arr, parent) {
      return arr
        ? Array(arr.length)
          .fill(1)
          .map((it, i) => (parent || parent === 0) ? `${parent}-${i}` : `${i}`)
        : []
    }
  },
  components: {
    FormLayout,
    LoopCheckbox
  }
}
</script>

<style lang='scss'>
  @import "variable/variable.scss";
  .iv-ct-wrapper {
    margin: 0 $three-double;
    .ivu-collapse-item {
      .ivu-collapse-header {
        position: relative;
        padding: 0 !important;
        background-color: #fff;
        border-bottom: 1px solid $iv-border-color;
        &:after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 48px;
          background-color: $iv-border-color;
          width: 1px;
        }
        > i {
          text-align: center;
          margin-right: $three-double;
          width: 48px;
          height: 38px;
          line-height: 38px;
        }
      }
    }
    
    .iv-ct-lv2 {
      border: none;
      .ivu-collapse-item {
        .ivu-collapse-header {
          &:after {
            left: 96px;
          }
          > i {
            margin-left: 48px;
          }
        }
      }
    }
    
    .iv-page-wrapper {
      position: relative;
      background-color: #FAFAFA;
      &:after {
        content: '';
        position: absolute;
        top: -$one-double;
        bottom: -$one-double;
        left: 96px;
        width: 1px;
        background-color: $iv-border-color;
      }
      .iv-page-item {
        position: relative;
        padding-left:  96px + $three-double;
        margin: $one-double 0;
      }
    }
    
    .ivu-collapse-content {
      padding: 0;
    }
    
    .ivu-collapse-content-box {
      padding: 0;
    }
    
    .ivu-row {
      position: absolute;
      top: 0;
      right: 0;
      left: 300px;
    }
    .ivu-icon-arrow-right-b:before {
      content: "\F3D3";
    }
    .iv-not-allow {
      cursor: not-allowed;
      height: 22px;
      line-height: 22px;
    }
  }
  
</style>
