const fs = require('fs')
const path = require('path')
const express = require('express')
const baseComponents = {}
const busniessComponents = {}
const app = express()
let camelizeRE = /-(\w)/g
const businessMap = {
  'inline-tree-list': {
    workhs: '1 / 5',
    total: -3
  },
  'select-list': {
    workhs: '0.5 / 2',
    total: -2
  },
  'tree-list': {
    workhs: '4 / 6',
    total: -9
  },
  'tree-list-cascading': {
    workhs: '2 / 2',
    total: -1
  },
  'remote-select': {
    workhs: '0.5 / 2'
  },
  'inline-collapse-table': {
    workhs: '4 / 6'
  },
  'organization': {
    workhs: '1 / 3',
    total: -7
  },
  'organizational-staff': {
    workhs: '1 / 3',
    total: -2
  }
}
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}
// -转换驼峰
let camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''})
})
// 首字母大写
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''})
})
// 读取文件夹
function readdir (src) {
  fs.readdir(src, (errs, files) => {
    //遍历
    files.forEach(item => {
      let dir = path.join(src, item)
      fs.stat(dir, (errs, stats) => {
        if (stats.isFile()) {
          if (!/\.vue$/.test(dir)) return
          //读取文件
          fs.readFile(dir, 'utf-8', (errs, data) => {
            //遍历组件中心，进行测试
            componentsDep(baseComponents, data, dir)
            componentsDep(busniessComponents, data, dir)
          })
        } else {
          readdir(dir)
        }
      })
    })
  })
}
//组件注册
function registComponents (src, base) {
  fs.readdir(src, (errs, files) => {
    files.forEach(item => {
      if (/\.md$/.test(item)) return
      let current = businessMap[item]
      if (!current) return
      base[item] = {
        title: capitalize(item),
        total: current.total || 0,
        links: [],
        news: 0,
        workhs: current.workhs
      }
    })
  })
}
//组件收集
function componentsDep (comp, data, dir) {
  let keys = Object.keys(comp)
  keys.forEach(key => {
    //格式转换
    let nomalKey = key
    let camelizeKey = camelize(key)
    let capitalizKey = capitalize(key)
    let reg = new RegExp(`/((${capitalizKey})|(${nomalKey})|(${camelizeKey}))\'`, 'gi')
    if (reg.test(data)) {
      reg.lastIndex = 0
      comp[key].total += data.match(reg).length
      comp[key].links.push(dir)
    }
  })
}
registComponents('./src/components', baseComponents)
registComponents('./src/page/business', busniessComponents)
readdir('./src/page')
app.get('/statistics', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.json({
    data: {
      base: baseComponents,
      busniess: busniessComponents
    }
  })
})
app.listen(3000, () => {
  console.log('sevre start 3000 port')
})
