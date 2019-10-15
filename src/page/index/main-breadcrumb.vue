<template>
  <div class="iv-breadcrumb-container">
    <Breadcrumb :separator="separator" class="iv-fs-14 iv-symbol-p16 iv-breadcrumb-wrapper">
      <BreadcrumbItem
        class="uit-breadcrumb-item"
        :to="{path: item.id, query: item.query}"
        :key="item.id"
        v-for="item in crumbsList">
        {{item.title}}
      </BreadcrumbItem>
    </Breadcrumb>
    <MainTitle :border="false">{{ crumbsTitle }}</MainTitle>
    <p class="iv-sub-title iv-fs-14 iv-fc-65" v-if="fromTitleDesc" v-html="fromTitleDesc">
    </p>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import MainTitle from '@/components/base/main-title'
export default {
  data () {
    return {
      separator: `<i class="icon iconfont icon-doubleright iv-fs-12 iv-fc-45"></i>`
    }
  },
  computed: {
    ...mapGetters([
      'crumbsList',
      'fromTitle',
      'fromTitleDesc'
    ]),
    crumbsTitle () {
      let title = (this.crumbsList[this.crumbsList.length - 1] || {}).title
      if (title && this.fromTitle) {
        return `${title} - ${this.fromTitle}`
      } else {
        return title || this.fromTitle
      }
    }
  },
  components: {
    MainTitle
  },
  watch: {
    $route () {
      //   console.log(this.$route)
    }
  },
  methods: {
    getList () {
      //获取当前路由
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/static/lib/css/base/variable.scss';
  .iv-breadcrumb-container {
    background: #fff;
    .iv-sub-title {
      padding: 0 $three-double $three-double;
      margin-top: -$two-double;
    }
  }
</style>
