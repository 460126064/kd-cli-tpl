let ExtractTextPlugin = require('extract-text-webpack-plugin');

let extractCSS = new ExtractTextPlugin('stylesheets/[name].css');
let extractLESS = new ExtractTextPlugin('stylesheets/[name].less');
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  module: {
    loaders: [{
      test: /\.(less)$/,
      loader: ExtractTextPlugin.extract('style', 'css!less'),
      exclude: /node_modules/,
      include: [resolve('src/static')]
    }]
  },
  plugins: [
    extractCSS,
    extractLESS
  ]
}