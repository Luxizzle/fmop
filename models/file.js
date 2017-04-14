var mongoose = require('mongoose')
var Schema = mongoose.Schema

var FileSchema = new Schema({
  name: String,
  fileId: String,
  uploader: String,
  mimetype: String,
  location: String
})

module.exports = mongoose.model('file', FileSchema)