<template>
  <div>
    <div v-if="isShow">
      <div class="iv-aide-wrapper" v-if="isFull" @click="changeFull">
        <div class="iv-outside">
          <div class="iv-middle">
          </div>
        </div>
        <div class="iv-inside">
          <span>使用助手</span>
        </div>
      </div>
      <div class="iv-aide-full"
      v-else
      @mousedown="mousedown"
      @mousemove="mousemove"
      @mouseup="mouseup"
      :style="initPosition"
      >
        <div class="iv-aide-header"
          @click="changeFull">
          <img :src="defaultSrc" draggable="false">
        </div>
        <div class="iv-aide-body">
          <ul>
            <li v-html="content"></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      defaultSrc: require('@/static/images/test.jpg'),
      isShow: false,
      isFull: true,
      initX: 24,
      initY: window.screen.height - 560,
      content: ''
    }
  },
  created () {
    document.addEventListener('mouseup', this.changeDown)
  },
  mounted () {},
  computed: {
    initPosition () {
      return {
        left: this.initX,
        top: this.initY
      }
    }
  },
  beforeDestroy () {
    document.removeEventListener('mouseup', this.changeDown)
  },
  methods: {
    changeFull () {
      this.isFull = !this.isFull
    },
    mousedown (e) {
      this.down = true
      this.offsetX = e.offsetX
      this.offsetY = e.offsetY
    },
    mousemove (e) {
      if (!this.down) return
      this.initX = `${e.clientX - this.offsetX}px`
      this.initY = `${e.clientY - this.offsetY}px`
    },
    mouseup () {
      this.changeDown()
    },
    changeDown () {
      this.down = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .iv-aide-wrapper {
    position: fixed;
    left: -58px;
    bottom: 8px;
    z-index: 9999;
    cursor: pointer;
    width: 112px;
    height: 72px;
    transition: all .5s ease-in-out 0s;
    &:hover {
      left: 0px;
      .iv-inside {
        text-align: center;
      }
    }
    .iv-outside {
      padding: 36px 56px;
      background:rgba(0,187,253,0.2);
      border-radius: 72px;
      position: absolute;
      animation: halo 4s ease-in-out 2s infinite;
      .iv-middle {
        padding: 28px 48px;
        background:rgba(0,187,253,0.4);
        border-radius: 56px;
        position: absolute;
        left: 8px;
        top: 8px;
      }
    }
    .iv-inside {
      width: 80px;
      height: 40px;
      line-height: 40px;
      position: absolute;
      z-index: 9999;
      left: 16px;
      top: 16px;
      border-radius: 40px;
      background:rgba(0,187,253,0.6);
      text-align: right;
      color: #fff;
      padding-right: 4px;
    }
  }
  //全屏展示
  .iv-aide-full {
    position: fixed;
    z-index: 9999;
    bottom: 24px;
    left: 24px;
    width: 320px;
    height: 480px;
    border:2px solid rgba(0,187,253,1);
    border-radius:8px;
    overflow: hidden;
    background: #fff;
  }
  @-webkit-keyframes halo {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    25% {
      transform: scale(1.4);
      opacity: 0;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes halo {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    25% {
      transform: scale(1.4);
      opacity: 0;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
