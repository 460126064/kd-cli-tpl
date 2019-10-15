const mongoose = require('mongoose')
const { Schema } = mongoose
const Proxy = new Schema({
  response: String
})
mongoose.model('Proxy', Proxy)
