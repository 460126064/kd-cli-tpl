<template>
  <div
    v-if="list.length"
    class="iv-operation-wrappers iv-symbol-pb8 iv-fs-14">
    <div class="iv-pull-right">
      <div
        v-for="(item, $index) in list"
        :key="$index"
        :class="[`uit-operation-${item.icon}`, list.length - 1 === $index ? '' : 'iv-m-r-8']"
        class="iv-pull-left iv-operation-list iv-hover-color iv-main-color iv-pointer">
        <!-- 下拉类型 -->
        <span v-if="item.type === 'Dropdown'">
        <Dropdown
          class="uit-dropdown iv-operation-dropdown"
          @on-visible-change="changeArrow"
          @on-click="handler(arguments[0], item.handler, item)"
          trigger="click">
          <span class="iv-button iv-fc-65">
            <IconFont :type="item.icon" class="iv-fs-16 iv-m-r-8"></IconFont>
            <span>{{item.label}}</span>
            <Icon
              :type="arrowUp ? 'ios-arrow-up' : 'ios-arrow-down'"></Icon>
            <!-- <Icon type="ios-arrow-up"></Icon> -->
          </span>
          <DropdownMenu slot="list">
              <DropdownItem
                :name="dropItem.value"
                v-for="(dropItem, $index) in item.optionList"
                :key="$index"
                :class="dropItem.uitClass ? dropItem.uitClass : `uit-operation-${dropItem.value}`">
                {{dropItem.label}}
              </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </span>
        <!-- render类型 -->
        <span v-else-if=" typeof item.render === 'function'">
        <IconFont v-if="item.icon" :type="item.icon" class="iv-fs-16 iv-m-r-8"></IconFont>
        <Expand
          :render="item.render"/>
      </span>
        <!-- 上传类型 -->
        <ButtonUpload
          :label="item.label"
          :icon="item.icon"
          v-bind="item.props"
          @on-upload-success="item.handler"
          @on-upload-error="item.handler"
          v-else-if="item.type === 'file'"></ButtonUpload>
        <!-- <span
          v-else
          class="iv-operation-btn-wrapper"
          :class="`uit-operation-item-${item.icon}`"
          @click="handler(item, item.handler)">

        </span> -->
        <Button
          v-else
          @click="handler(item, item.handler)"
          :class="item.uitClass ? item.uitClass : `uit-operation-item-${item.icon}`"
          :type="item.type || (item.icon === 'Plus' ? 'primary' : 'ghost')">
          <IconFont :type="item.icon" class="iv-fs-14 iv-m-r-4"></IconFont>
          <span
            :class="
            (whiteTextList.includes(item.type) && ' ')
            ||
            (item.icon === 'Plus' ? '' : 'iv-fc-65')"
          >{{item.label}}</span>
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
/*
   * @description 引入iconfont组件
   */
import IconFont from '@/components/iconfont'
import ButtonUpload from '@/page/business/button-upload'
import Expand from './expand'

export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      arrowUp: false
    }
  },
  components: {
    IconFont,
    Expand,
    ButtonUpload
  },
  inject: {
    deleteChange: {
      default () {
        /*eslint-disable*/
          return new Function
        }
      },
      addChange: {
        default() {
          /*eslint-disable*/
          return new Function
        }
      },
      onOperatorClick: {
        default() {
          /*eslint-disable*/
          return new Function
        }
      }
    },
  created () {
    this.whiteTextList = ['info', 'primary', 'success', 'warning', 'error']
  },
  methods: {
    handler(item, handler, origin) {
      //如果是删除，我们触发内部模态框
      if (item.delete || (item === 'delete' && origin.delete)) {
        this.deleteChange()
        return
      }
      //如果是行内编辑，可以触发新增逻辑
      if (item.add) {
        this.addChange(item)
        return
      }
      handler && handler(item)
      //适应新的逻辑，在没有handler的情况下，我们要把点击事件整体暴露出去
      if (!handler) {
        this.onOperatorClick(item)
      }
    },
    changeArrow(arrowUp) {
      this.arrowUp = arrowUp
    }
  }
  }
</script>
<style lang="scss">
  @import '@/static/lib/css/base/variable.scss';

  .iv-operation-wrappers {
    &::after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .iv-operation-btn-wrapper {
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  .iv-operation-dropdown {
    .iv-button {
      position: relative;
      top: -1px;

      &:focus {
        box-shadow: 0 0 0 2px transparent;
      }
    }

    .ivu-dropdown-rel {
      border: 1px solid #dddee1;
      box-sizing: border-box;
      height: 24px;
      padding: 0 6px;
      border-radius: 4px;
      transition: all .3s linear 0s;

      &:hover {
        border-color: $iv-main-color;
      }
    }
  }
</style>
