'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // sourcemap， cheap-module-eval-source-map在开发环境下最快
  devtool: config.dev.devtool,
  mode: 'development',
  // these devServer options should be customized in /config/index.js
  devServer: {
    //禁止检测host配置
    disableHostCheck: true,
    //阻止模块热替换控制台输出
    clientLogLevel: 'warning',
    //历史记录回退，防止页面出现404
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
      ]
    },
    //热模块更新,如果为true，webpack会自动添加webpack.HotModuleReplacementPlugin （HMR）插件
    hot: true,
    //虚拟服务器路径since we use CopyWebpackPlugin
    contentBase: false,
    //如果为 true ，开启虚拟服务器时，为你的代码进行压缩。加快开发流程和优化的作用
    compress: true,
    //域名
    host: HOST || config.dev.host,
    //端口
    port: PORT || config.dev.port,
    //是否自动打开浏览器
    open: config.dev.autoOpenBrowser,
    //如果为 true ，在浏览器上全屏显示编译的errors或warnings
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    //公共路径配置，配置成功后protocal + host + publicPath + path
    //注意：此配置只适用于开发环境下请求配置
    //http://localhost:8080/app.js --> http://localhost:8080/assets/app.js
    publicPath: config.dev.assetsPublicPath,
    //服务器代理
    proxy: config.dev.proxyTable,
    //启动quiet后，只展示启动信息，其余错误屏蔽
    quiet: true,

    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    ...utils.htmlPlugins(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash:7].css'),
      allChunks: true
    }),
    new CSSSplitWebpackPlugin({
      size: 4000,
      filename: 'static/css/[name]-[part].[ext]'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/page/compatible'),
        to: 'compatible',
        ignore: ['.*']
      }
    ])
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./vendors-manifest.json')
    // })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
