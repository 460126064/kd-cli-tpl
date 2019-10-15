<template>
<div class="iv-floor">
  <transition-group
    name="floor"
    tag="div">
    <ul key="menu">
      <li class="iv-m-b-24">
        <div
          class="iv-floor-icon iv-floor-close"
          @click="showNav">
          <Icon type="navicon-round"></Icon>
        </div>
        <div class="iv-floor-line"></div>
      </li>
    </ul>
    <ul
      key="nav"
      v-if="isShow">
      <li class="iv-m-b-24">
        <div
          class="iv-floor-icon iv-floor-close"
          @click="hideNav">
          <Icon type="close"></Icon>
        </div>
        <div class="iv-floor-line"></div>
      </li>
      <li
        :class="isClass === index ? 'iv-m-b-24 iv-content-li iv-active-li' : 'iv-m-b-24 iv-content-li'"
        v-for="(item,index) in floorParams"
        :key="index"
        @click="floorScroll(item.floorClassName, index)">
        <div class="iv-floor-name iv-fs-12">
          {{ item.floorName }}
        </div>
        <div class="iv-floor-icon">
          <Icon type="aperture"></Icon>
        </div>
        <div class="iv-floor-line"></div>
      </li>
    </ul>
  </transition-group>
</div>
</template>

<script>
export default {
  data () {
    return {
      isShow: true,
      isClass: 0
    }
  },
  props: {
    floorParams: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {
    this.startScroll(true)
  },
  methods: {
    //点击楼层页面滚动到指定位置
    floorScroll (valName, idx) {
      this.startScroll()
      let valTop = document.querySelector(valName).offsetTop
      this.isClass = idx
      window.scrollTo(0, valTop - 60)
      this.$emit('parentEvent', idx)
    },
    //滚动到某一楼层为此楼层添加样式
    startScroll (bool) {
      if (bool) {
        window.onscroll = this.throttle(this.scrollTops)
      } else {
        window.onscroll = null
        setTimeout(() => {
          window.onscroll = this.throttle(this.scrollTops)
        }, 200)
      }
    },
    throttle (method) {
      var timer = null
      return function () {
        clearTimeout(timer)
        timer = setTimeout(function () {
          method()
        }, 200)
      }
    },
    scrollTops () {
      let that = this
      let divList = document.querySelectorAll('.iv-floors')
      let scroTop = document.body.scrollTop || document.documentElement.scrollTop
      for (let i = 0; i < divList.length; i++) {
        let parentTop = divList[i].offsetParent.offsetTop
        if (scroTop + innerHeight / 2 >= divList[i].offsetTop + parentTop) {
          that.isClass = i
        }
      }
    },
    //隐藏楼层导航
    hideNav () {
      this.isShow = false
    },
    //显示楼层导航
    showNav () {
      this.isShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/static/lib/css/base/variable.scss';
.iv-floor {
  position: fixed;
  top: 28px;
  right: 4px;
  z-index: 9;
  ul {
    li {
      list-style: none;
      padding: 0 0 12px 0;
      position: relative;
      width: 84px;
      height: 24px;
      float: right;
      clear: both;
      .iv-floor-line {
        position: absolute;
        top: 24px;
        right: 12px;
        height: 100%;
        border-left: 1px solid #fff;
      }
      .iv-floor-icon {
        position: absolute;
        right: 0;
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        i {
          font-size: 16px;
          line-height: inherit;
        }
      }
      .iv-floor-close {
        background: #ddd;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0.5;
      }
      .iv-floor-close:hover {
        color: #2898FF;
        opacity: 1;
      }
      .iv-floor-name {
        position: absolute;
        top: 0;
        right: 20px;
        padding: 1px 1px 10px 0;
        cursor: pointer;
        margin-right: 4px;
      }
    }
    li:last-child {
      .iv-floor-line {
        display: none;
      }
    }
    .iv-content-li {
      background: #fff;
      border-radius: 16px;
      line-height: 12px;
      box-shadow:0px 4px 8px 1px rgba(0,0,0,0.1);
      .iv-floor-name {
        line-height: 26px !important;
        opacity: 0.25;
      }
      .iv-floor-icon {
        opacity: 0.5;
      }
    }
    .iv-content-li:hover {
      .iv-floor-name {
        color: #2898FF;
        opacity: 1;
      }
      .iv-floor-icon {
        opacity: 1;
      }
    }
    /*.iv-content-li:hover{
      width: 108px;
      height: 32px;
      background: #fff;
      line-height: 32px;
      .iv-floor-line {
        top: 32px;
        right: 12px;
      }
      .iv-floor-name {
        color: #2898FF;
        font-size: 14px !important;
        line-height: 32px !important;
        margin-right: 8px;
        opacity: 1;
      }
      .iv-floor-icon {
        line-height: 32px;
        padding-right: 4px;
        opacity: 1;
        i {
          font-size: 24px;
        }
      }
    }*/
    .iv-active-li{
      width: 108px;
      height: 32px;
      background: #fff;
      line-height: 32px;
      animation: slin 4s ease-in-out 2s infinite;
      .iv-floor-line {
        top: 32px;
        right: 12px;
      }
      .iv-floor-name {
        color: #2898FF;
        font-size: 14px !important;
        line-height: 32px !important;
        margin-right: 8px;
        opacity: 1;
      }
      .iv-floor-icon {
        line-height: 32px;
        padding-right: 4px;
        opacity: 1;
        i {
          font-size: 24px;
        }
      }
    }
  }
  .floor-enter-active, .floor-leave-active {
    transition: all 1s;
  }
  .floor-enter, .floor-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
}
</style>
