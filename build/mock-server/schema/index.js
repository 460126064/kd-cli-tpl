const mongoose = require('mongoose')
const { Schema } = mongoose
module.exports = function (name) {
  /* eslint-disable no-new */
  const Proxy = new Schema({
    response: String
  })
  return mongoose.model(name, Proxy)
}
