<template>
  <div class="iv-status-wrapper">
    <span
      class="iv-status-bar iv-pull-left"
      :class="'iv-' + maps.mapColor[[item[type]]]"></span>
    <span class="iv-status-text iv-pull-left iv-m-r-8 iv-m-l-8">{{maps.mapState[[item[type]]]}}</span>
    <Poptip
      trigger="hover"
      class="iv-status-wrapper"
      v-if="maps.mapTips && maps.mapTips[[item[type]]]"
      :title="maps.mapTips[[item[type]]].title"
      width="256"
      :content="maps.mapTips[[item[type]]].content">
        <span class="iv-status-tips iv-pointer iv-pull-left iv-text-center">?</span>
    </Poptip>
  </div>
</template>
<script>
import { Poptip } from 'iview'
export default {
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    },
    maps: {
      type: Object,
      default () {
        return {
          mapState: {},
          mapColor: {},
          mapTips: {}
        }
      }
    }
  },
  components: {
    Poptip
  }
}
</script>
<style lang="scss" scoped>
  .iv-status-wrapper {
    .iv-status-bar {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-top: 8px;
      &.iv-red {
        background: red;
      }
      &.iv-green {
        background: #52C41A;
      }
      &.iv-blue {
        background: blue;
      }
      &.iv-yellow {
        background: #FAAD14;
      }
      &.iv-grey {
        background: rgba(0, 0, 0, .09);
      }
    }
    .iv-status-tips {
      width: 12px;
      height: 12px;
      margin-top: 4px;
      line-height: 12px;
      border-radius: 50%;
      background: #FAAD14;
      color: #fff;
    }
  }
</style>
<style lang="scss">
.iv-status-wrapper {
  .ivu-poptip-body-content {
    white-space: normal;
  }
}
</style>
