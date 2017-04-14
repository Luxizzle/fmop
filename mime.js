module.exports = class Mime {
  constructor(config) {
    this.types = config.types
  }

  get(mime) {
    mime = mime ? mime : ''
    var ext = this.types[mime] ? '.' + this.types[mime] : '';
    return ext
  }
}