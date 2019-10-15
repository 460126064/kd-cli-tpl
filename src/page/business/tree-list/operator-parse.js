export default {
  methods: {
    getOperation () {
      if (this.configUrl) {
        return this.remoteOperationList
      }
      return this.operationList
    },
    getOperationList (data) {
      this.remoteOperationList = this.initOperationList(data)
    },
    initOperationList (data) {
      let operationList = []
      data.map(item => {
        item.id === 'basicinfo' && item.attributes && item.attributes.map(opt => {
          operationList.push({
            label: opt.displayName || opt.title,
            type: opt.type,
            icon: 'Plus'
          })
        })
      })
      return operationList
    }
  }
}
