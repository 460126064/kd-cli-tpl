process.env.NODE_ENV = 'production'
const webpack = require('webpack')
const config = require('../config')
const utils = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const merge = require('webpack-merge')
const chalk = require('chalk')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
webpack(merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true
    })
  ]
}), (err, stats) => {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')
  //如果存在错误，终止进程提交
  if (stats.hasErrors()) {
    console.log(chalk.red('eslint failed with errors.\n'))
    process.exit(1)
  }
})
