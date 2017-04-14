var mongoose = require('mongoose')
var Schema = mongoose.Schema

var KeySchema = new Schema({
  key: String,
  name: String
})

module.exports = mongoose.model('key', KeySchema)