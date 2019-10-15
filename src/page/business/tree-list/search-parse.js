export default {
  methods: {
    getSearch () {
      if (this.configUrl) {
        return this.remoteSearchList
      }
      return this.searchList
    },
    getSearchList (data) {
      this.remoteSearchList = this.initSearchList(data)
    },
    initSearchList (data = []) {
      let searchList = []
      data.map(item => {
        item.id === 'basicinfo' && item.attributes && item.attributes.map(opt => {
          searchList.push({
            label: opt.displayName || opt.title,
            name: opt.key,
            // type: opt.type
            type: 'Input'
          })
        })
      })
      return searchList
    }
  }
}
