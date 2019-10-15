const mongoose = require('mongoose')
const config = require('./config.js')
const schema = require('./schema')
// import { resolve } from 'path'
// import fs from 'fs'
// const models = resolve(__dirname, './schema')
// fs.readdirSync(models)
//   .filter(file => ~file.search(/^[^\.].*\.js$/))
//   .forEach(file => require(resolve(models, file)))
const Currying = fn => {
  return function () {
    return new Promise((resolve, reject) => {
      mongoose.connect(config.db, {
        keepAlive: 120,
        useNewUrlParser: true
      })
      mongoose.connection.on('disconnected', () => {
        mongoose.connect(config.db, {
          keepAlive: 120,
          useNewUrlParser: true
        })
      })
      mongoose.connection.on('error', err => {
        console.error(err)
        reject(err)
      })
      mongoose.connection.once('open', async () => {
        //连接mongose
        console.log('Connected to MongoDB', config.db)
        resolve()
      })
    }).then((res) => {
      return fn && fn.apply(fn, arguments)
    })
  }
}
//新增
exports.addDataBase = Currying((name, res) => {
  const Proxy = schema(name)
  const proxy = new Proxy({
    response: res
  })
  proxy.save((err, file) => {
    if (err) console.log(`${name}保存失败, ${err}`)
  })
})
exports.queryDataBase = Currying((name) => {
  const Proxy = schema(name)
  return new Promise((resolve, reject) => {
    Proxy.find(function (err, res) {
      if (err) {
        console.log(`${name}查询失败, ${err}`)
        reject(err)
        return void 0
      }
      resolve(res)
    })
  })
})
