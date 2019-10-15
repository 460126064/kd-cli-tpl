<template>
  <div
    class="layout"
    :class="[headerNav.style === 'banner' ? 'header-banner' : '']">
    <MainSider
      ref="MainSider"
      @on-change="change"
      :mouse-enter="isMouseenter" />
    <Layout class="iv-layout"
            :style="{marginLeft: isMouseenter ? '80px' : `${sliderWidth}px`}">
      <Header class="iv-layout-header">
        <div v-if="headerNav.style === 'banner'" class="iv-pull-left iv-banner-logo iv-fs-20 iv-fw-b">
          <img src="../../static/images/logo-top.png">
        </div>
        <IconFont
          type="outdent"
          class="iv-pull-left iv-fs-24 iv-control-slider"
          @click.native="collapsedSider"
          :class="rotateIcon"></IconFont>
        <TopInfo class="" />
      </Header>
      <Content>
        <Panel padding="0">
          <MainBread></MainBread>
          <article class="iv-article-wrapper">
            <MainRouter></MainRouter>
          </article>
        </Panel>
      </Content>
    </Layout>
  </div>
</template>
<script>
import TopInfo from '../header/top-info'
import Panel from 'components/panel'
import MainSider from './main-sider'
import MainBread from './main-breadcrumb'
import IconFont from '@/components/iconfont'
import {mapGetters} from 'vuex'
import MainRouter from './main-router'
export default {
  data () {
    return {
      isMouseenter: false
    }
  },
  components: {
    TopInfo,
    Panel,
    MainSider,
    MainBread,
    IconFont,
    MainRouter
  },
  computed: {
    ...mapGetters(['headerNav', 'sliderWidth']),
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$aide.show(true).update('<h1>我是首页</h1>')
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'login') this.$aide.show(false) && next()
  },
  methods: {
    change (value) {
      this.isMouseenter = value
    },
    collapsedSider () {
      this.$refs.MainSider.collapsedSider()
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'variable/variable.scss';
  .layout{
    border: 1px solid #d7dde4;
    background: #eee;
    position: relative;
    border-radius: 4px;
    //overflow: hidden;
    border-bottom: none;
    min-height: 100vh;
    .iv-layout {
      transition: all .3s;
      &.iv-layout-expland {
        margin-left: 80px;
      }
      .iv-layout-header {
        background: #fff;
        box-shadow: 0 2px 3px 2px rgba(0,0,0,.1);
        padding-left: 24px;
        padding-right: 0px;
      }
      .iv-control-slider {
        margin-top: $two-double + 10px;
      }
    }
    .ivu-menu {
      transition: all .3s;
      overflow: hidden;
      white-space: nowrap;
      &.iv-menu-wrapper {
        overflow: hidden;
        width: 0 !important;
      }
    }
    .menu-icon{
      transition: all .3s;
      cursor: pointer;
    }
    .rotate-icon{
      transform: rotate(-90deg);
    }
  }
  .layout.header-banner {
    /deep/ .iv-slider {
      background: #001529;
      .ivu-menu {
        background: #001529;
        .ivu-menu-submenu {
          .ivu-menu {
            background: #000c17;
          }
        }
      }
    }
    /deep/ .iv-layout-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
      background-color: #002140;
      color: #fff;
      box-shadow: none;
      .iv-user-name,
      .icon-poweroff {
        color: #fff !important;
      }
      .iv-banner-logo {
        display: inline-block;
        padding-top: 18px;
      }
    }
    /deep/ .ivu-layout-content {
      margin-top: 64px;
    }
  }
  .layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  #iv-indexCard{
    .iv-layout{
      margin-left: 0;
    }
  }
</style>
