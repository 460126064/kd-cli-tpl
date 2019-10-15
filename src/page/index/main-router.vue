<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters(['cacheList'])
  },
  render (h) {
    return (
      <transition name="router">
        <keep-alive
          include={this.cacheList}>
          <router-view></router-view>
        </keep-alive>
      </transition>
    )
  }
}
</script>
<style lang="scss" scoped>
.router-enter-active, .router-leave-active {
  transition: all .8s linear 0s;
}
.router-enter {
  margin-top: 50px;
  opacity: 0.3;
}
.router-leave-to {
  opacity: 0;
  display: none;
}
</style>
