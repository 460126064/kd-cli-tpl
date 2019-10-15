import IconFont from 'components/iconfont'
import SelectTree from '@/components/select-tree'
import Select from './remote-search'
import DatePicker from './datePicker'
let tableModal = {}
let searchKeyMap = {}
function searchList (val, key, searchKey) {
  searchKeyMap[searchKey] = val
  tableModal[key] = val
}
function searchRes () {
  this.getList(searchKeyMap).then(({data}) => {
    this.count = 1
    this.total = data.count
    this.data = data.data
    this.data.unshift({...tableModal})
    this.loading = false
    this.$emit('on-list', this.data, data)
  })
}

export default function (c, params) {
  const sendSearch = searchRes.bind(this)
  const search = searchList.bind(this)
  const cacheVal = params.row[params.column.key]
  /* eslint-disable */
  const h = c
  const {
    _index,
    showType,
    searchOptionList,
    optionList,
    isOperate,
    searchKey,
    key,
    immediateSearch,
    props,
    inputIcon,
    noSearch,
    drag} = params.column;
  // 点击树节点切换表格数据时获取之前的搜索数据并再次显示
  if (searchKey && this.$attrs.listData[searchKey]) {
    if (!this.data[0][key]) {
      let value = this.$attrs.listData[searchKey]
      this.$set(this.data[0], key, value)
    }
  }
  const createInput = () => {
    const input = c('Input', {
      props: {
        placeholder: '请搜索',
        clearable: true,
        value: cacheVal
      },
      // nativeOn: {
      //   'change': (val) => {
      //     search(val.target.value, key, searchKey)
      //   },
      // },
      on: {
        'on-change': (val) => {
          search(val.target.value, key, searchKey)
        }
      },
      class: 'uit-table-input-form'
    })
    let btn
    if (inputIcon) {
      btn = c(IconFont, {
        props: {
          type: inputIcon.type
        },
        on: {
          click: ($event) => {
            inputIcon.handler && inputIcon.handler(params, $event)
          }
        }
      })
    }
    if (immediateSearch) {
      setTimeout(() => {
        search(cacheVal, key, searchKey)
      })
    }

    return c('div', {
      class: `iv-table-search-form${btn ? ' input-btn' : ''}`
    }, [input, btn])
  }
  const createSelect = () => {
    return c(Select, {
      props: {
        value: cacheVal || '',
        clearable: true,
        searchOptionList,
        optionList,
        props
      },
      on: {
        'on-change': val => search(val, key, searchKey)
      },
      class: 'iv-table-search-form uit-table-search-form'
    })
  }
  const createOperate = () => {
    return c('ul', {
      class: 'iv-operate-wrapper'
    }, [
      c('li', {
        class: 'iv-fs-14 iv-operate-item iv-pull-left iv-main-color iv-main-hover-color iv-pointer uit-inline-search',
        on: {
          click: () => {
            this.currentPage = 1
            sendSearch()
          }
        }
      }, '搜索'),
      c('li', {
        class: 'iv-fs-14 iv-operate-item iv-pull-left iv-main-color iv-main-hover-color iv-pointer uit-inline-rest-search',
        on: {
          click: () => {
            for (let item in searchKeyMap) {
              searchKeyMap[item] = ''
            }
            this.currentPage = 1
            tableModal = {}
            sendSearch()
          }
        }
      }, '重置')
    ])
  }
  const createDatePicker = () => {
    return c(DatePicker, {
      props: {
        value: cacheVal,
        props
      },
      on: {
        'on-ok': (val) => {
          search(val, key, searchKey)
        },
        'on-clear': () => {
          search(undefined, key, searchKey)
        }
      },
      class: 'uit-table-datePicker-form'
    })
  }
  const createSearchIcon = () => {
    return c('Icon', {
      props: {
        type: 'search'
      },
      class: 'iv-fs-20'
    })
  }
  const createSearchTree = () => {
    return c(SelectTree, {
      props: {
        clearable: true,
        value: cacheVal || [],
        optionData: optionList,
        treeUrl: params.column.treeUrl,
        props
      },
      on: {
        'on-change': val => {
          console.log(val, 'vvv')
          const _cacheVal = cacheVal || []
          if (!val.length || val.length !== _cacheVal.length || !val.every(v => _cacheVal.includes(v))) {
            return search(val, key, searchKey)
          }
        }
      },
      class: 'uit-table-selectTree-form'
    })
  }
  if (noSearch) {
    if (_index === 0) {
      return createSearchIcon()
    }
    return
  }
  if (drag) {
    return createSearchIcon()
  }
  if (isOperate) {
    return createOperate()
  }
  if (!showType || showType === 'input') {
    return createInput()
  }
  if (showType === 'select') {
    return createSelect()
  }
  if (showType === 'datePicker') {
    return createDatePicker()
  }
  if (showType === 'searchTree') {
    return createSearchTree()
  }
}
