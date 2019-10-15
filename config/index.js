'use strict'
const Mock = require('../build/mock-server/index.js')
const conf = require('../build/mock-server/config.js')
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    //代理配置
    proxyTable: {
      // '/api/api-cityopt/': {
      //   /*代理地址*/
      //   target: 'http://127.0.0.1:40106',
      //   pathRewrite: {
      //     /*代理规则重写，用于代理转发*/
      //     '^/api/api-cityopt/': ''
      //   },
      //   headers: {
      //     'authService.USERID': '-1',
      //     'authService.SCOPECODE': '/0',
      //     'authService.USERNAME': '6LaF57qn566h55CG5ZGY',
      //     'authService.ROLES': 'c25e4f01-e2a9-11e8-8d6f-0242ac140003'
      //   }
      // },
      '/api/api-json/': {
        /*代理地址*/
        target: 'http://39.106.13.180:8080',
        pathRewrite: {
          '^/api/api-json/': ''
        }
      },
      // '/api/api-json/': {
      //   /*代理地址*/
      //   target: 'http://118.190.159.137',
      //   pathRewrite: {
      //     '^/api/api-json/': ''
      //   },
      //   headers: {
      //     'host': 'demo.software4j.com'
      //   }
      // },
      // '/api/': {
      //   /*代理地址*/
      //   target: 'http://118.190.159.137',
      //   pathRewrite: {
      //     /*代理规则重写，用于代理转发*/
      //     '^/api/': ''
      //   },
      //   headers: {
      //     'host': 'demo.software4j.com'
      //
      // }
      // '/api/': {
      //   /*代理地址*/
      //   target: 'http://192.168.0.178:40029',
      //   pathRewrite: {
      //     /*代理规则重写，用于代理转发*/
      //     '^/api/': ''
      //   }
      // }
      '/api/': {
        /*代理地址*/
        target: 'http://192.168.12.103:10000/mock/5da5b9a29a7d9504fd03b607',
        pathRewrite: {
          /*代理规则重写，用于代理转发*/
          '^/api/': ''
        }
      }
    },
    /*本地服务域名，可以被process.env.HOST重写*/
    /* can be overwritten by process.env.HOST*/
    host: 'localhost',
    /*本地服务端口，可以被process.env.PORT重写*/
    /*can be overwritten by process.env.PORT, if port is in use, a free one will be determined*/
    port: 8888,
    /*是否自动打开浏览器*/
    autoOpenBrowser: false,
    /*在浏览器是否展示错误蒙层*/
    errorOverlay: true,
    /*是否展示错误的通知*/
    notifyOnErrors: true,
    /*webpack-dev-servr的watchOptions的一个选项,用来选择监测文件改变的方式*/
    /*poll为true改为轮询方式，后面可以是number类型，用来指定查询周期*/
    /* https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-*/
    poll: false,

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    /*是否使用ESlint*/
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    /*如果设置为true，在浏览器中，eslint的错误和警告会以蒙层的方式展现*/
    showEslintErrorsInOverlay: true,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    /*source-map的类型*/
    devtool: 'inline-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    /*指定是否通过在文件名称后面添加一个查询字符串来创建source map的缓存*/
    cacheBusting: true,
    /*开启css的source map*/
    cssSourceMap: true
  },

  build: {
    // Template for index.html
    /*html文件的生成的地方*/
    index: path.resolve(__dirname, '../../../dist/admin/index.html'),

    // Paths
    /* 编译生成的文件的根目录*/
    assetsRoot: path.resolve(__dirname, '../../../dist/admin'),
    /*编译生成的静态文件的目录*/
    assetsSubDirectory: 'static',
    /*编译发布的根目录，可配置为资源服务器域名或者cdn域名*/
    assetsPublicPath: '',

    /**
     * Source Maps
     */
    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    /*关闭生产环境的gzip压缩*/
    productionGzip: false,
    /*gzip文件压缩类型*/
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
