<template>
  <Sider
    @mouseenter.native="enterSider"
    @mouseleave.native="leaveSider"
    :width="sliderWidth"
    collapsed-width="80"
    ref="side1"
    class="iv-slider"
    collapsible
    v-model="isCollapsed"
    hide-trigger>
    <div class="iv-logo-wrapper">
      <div class="iv-logo-title iv-fs-20 iv-fw-b"></div>
    </div>
    <Menu
      ref="mainMenu"
      :class="{'iv-menu-wrapper': isCollapsed}"
      :active-name="menuActiveName"
      theme="dark"
      width="auto"
      :open-names="menuOpenName"
      accordion>
      <template v-if="!isCollapsed">
        <Submenu
          :key="menu.id"
          :name="menu.id"
          v-for="menu in menus">
          <template slot="title">
            <Icon
              style="vertical-align: middle;"
              type="android-apps" class="iv-fs-20"></Icon>
            {{menu.title}}
          </template>
          <template v-for="childMenu in menu.children">
            <template v-if="childMenu.children && childMenu.children.length">
              <Submenu
                class="iv-sub-menu"
                :key="childMenu.id"
                :name="childMenu.id">
                <template slot="title">
                  {{childMenu.title}}
                </template>
                <MenuItem
                  v-for="subChildMenu in childMenu.children"
                  :key="subChildMenu.id"
                  :name="subChildMenu.id"
                  @click.native="turnToPage(subChildMenu.id)">
                  <div v-text="subChildMenu.title"></div>
                  <router-link :to="subChildMenu.id" tag="div"></router-link>
                </MenuItem>
              </Submenu>
            </template>
            <MenuItem
              v-else
              :key="childMenu.id"
              :name="childMenu.id"
              @click.native="turnToPage(childMenu.id)">
              <div v-text="childMenu.title"></div>
              <router-link :to="childMenu.id" tag="div"></router-link>
            </MenuItem>
          </template>
        </Submenu>
      </template>
      <Icon
        v-else
        class="iv-fs-20"
        style="color: #fff;"
        type="android-apps"></Icon>
    </Menu>
  </Sider>
</template>
<script>
import menuRouter from '@/mixins/menu-router'
import {mapGetters, mapMutations} from 'vuex'
import { indexRouter, power } from '@/config'
import MenuList from './menu-conf'
const logo = require('images/logo.png')
const logoSimple = require('images/logo-simple.png')
export default {
  mixins: [menuRouter],
  props: {
    mouseEnter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isCollapsed: false,
      menus: [],
      logo: logo
    }
  },
  computed: {
    ...mapGetters([
      'menuActiveName',
      'menuOpenName',
      'sliderWidth'
    ]),
    logoBg () {
      return {
        background: `url(${this.logo}) no-repeat`
      }
    }
  },
  created () {
    this.getMenuList()
  },
  watch: {
    mouseEnter (newVal) {
      this.logo = !newVal ? logo : logoSimple
    }
  },
  methods: {
    ...mapMutations([
      'MENU_LIST',
      'CRUMBS_LIST',
      'MENUACTIVENAME',
      'ISCOLLAPSED'
    ]),
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
      this.ISCOLLAPSED(this.isCollapsed)
      this.$emit('on-change', this.isCollapsed)
    },
    enterSider () {
      this.isCollapsed && this.$emit('on-change', true) && (this.logo = logo) && this.$refs.side1.toggleCollapse()
    },
    leaveSider () {
      !this.isCollapsed && this.mouseEnter && (this.logo = logoSimple) && this.$refs.side1.toggleCollapse()
    },
    turnToPage (name) {
      if (name === this.$route.name) return
      //重置面包屑
      this.CRUMBS_LIST(this.menuMap.get(name))
      this.$router.push({
        name: name
      })
    },
    getMenuList () {
      let getMenu = power ? this.$ajax({
        url: 'workbench/user/menu',
        method: 'GET',
        data: {
          client: 'PCM'
        }
      }) : Promise.resolve({
        data: {
          data: MenuList
        }
      })
      getMenu.then(({data}) => {
        let menus = data.data.concat(/*templateMenu*/ [])
        this.menuMap = this.generateHashMap(menus)
        localStorage.setItem('menuMap', JSON.stringify(this.menuMap))
        this.menus = menus
        this.MENU_LIST(menus)
        !JSON.parse(sessionStorage.crumbsList || '[]').length && this.CRUMBS_LIST(this.menuMap.get(indexRouter))
        this.getCurrentRoute()
        //重置刷新
        this.$nextTick(() => {
          this.$refs.mainMenu.updateOpened()
          this.$refs.mainMenu.updateActiveName()
        })
      })
    },
    generateHashMap (menus = {}) {
      let map = new Map()
      function DFS (menus) {
        let {children} = menus
        children.forEach((menu, index) => {
          if (menu?.children?.length) {
            DFS(menu, menu)
          }
          map.set(menu.id, (map.get(menu.id) || menus.id ? [{
            title: menus.title,
            id: menus.id
          }] : []).concat({
            title: menu.title,
            id: menu.id
          }))
        })
      }
      DFS({
        children: menus
      })
      return map
    }
  }
}
</script>
<style lang="scss" scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    border-bottom: none;
    min-height: 100vh;
    .iv-logo-wrapper {
      height: 48px;
      box-shadow: 0 2px 6px 0;
      .iv-logo-title {
        color: #fff;
        margin-top: 18px;
        margin-left: 24px;
      }
      .iv-logo {
        height: 32px;
        line-height: 32px;
        background: #002140;
        border-radius: 2px;
        margin: 16px 24px 0 24px;
        color: #fff;
        text-align: center;
      }
    }
    .iv-slider {
      position: fixed;
      height: 100vh;
      left: 0;
      overflow: auto;
      z-index: 99;
    }
    .iv-layout {
      transition: all .3s;
      margin-left: 216px;
      &.iv-layout-expland {
        margin-left: 80px;
      }
      .iv-layout-header {
        background: #fff;
        box-shadow: 0 2px 3px 2px rgba(0,0,0,.1);
        padding-left: 24px;
      }
      .iv-control-slider {
        line-height: 64px;
        height: 64px;
      }
    }
    .ivu-menu {
      transition: all .3s;
      overflow: hidden;
      white-space: nowrap;
      &.iv-menu-wrapper {
        overflow: hidden;
        text-align: center;
        // width: 0 !important;
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
</style>
<style lang="scss">
  .iv-sub-menu {
    .ivu-menu-submenu-title {
      margin-left: 24px;
    }
  }
  .iv-layout {
    background: #eee;
  }
</style>
