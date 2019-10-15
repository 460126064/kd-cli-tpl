<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import { mainColor } from '@/config'
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  created () {
    localStorage.setItem('skinColor', mainColor)
    //根据主色调计算其他颜色值
    this.skin({
      hoverColor: this.$api.colorComputed(mainColor, 5),
      clickColor: this.$api.colorComputed(mainColor, 7),
      bgColor: this.$api.colorComputed(mainColor, 1)
    })
  },
  methods: {
    ...mapMutations({
      skin: 'SKIN'
    })
  },
  watch: {
    '$route' (to, from) {
      if (to.name != 'welcome') {
        let brame = document.querySelector('.iv-breadcrumb-wrapper')
        if (brame) {
          brame.style.display = 'block'
        }
      } else {
        let brame = document.querySelector('.iv-breadcrumb-wrapper')
        if (brame) {
          brame.style.display = 'none'
        }
      }
    }
  }
}
</script>

<style lang="scss">
/*全局样式注入*/
@import '@/static/lib/css/base/index.scss';
body,html,#app {
  height: 100%;
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f5f7f9;
  }
}
::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: #c2c2c2;
}
::-webkit-scrollbar-track {
  border-radius: 6px;
  background: rgba(250,250,250,.9);
}
</style>
