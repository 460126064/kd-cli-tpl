export default {
  methods: {
    getCurrentRoute () {
      let crumbsList = this.$store.state.crumbsList
      //修改Store菜单
      this.$store.commit('MENUACTIVENAME', crumbsList[crumbsList.length - 1].id)
      this.$store.commit('MENUOPENNAME', [crumbsList[0].id])
    }
  }
}
