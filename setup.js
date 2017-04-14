var inquirer = require('inquirer')
var fs = require('fs')

var questions = [
  {
    type: 'input',
    name: 'url',
    message: 'Root url for fmop',
    default: 'http://localhost:4082'
  },
  {
    type: 'input',
    name: 'port',
    message: 'Port to run fmop on',
    default: 4082,
    filter: function(input) {
      return new Promise((res, rej) => {
        if (typeof input !== 'number') {

          return rej('You need to provide a number');
        }

        res(input);
      })
    }
  },
  {
    type: 'input',
    name: 'mongodb',
    message: 'Mongodb url',
    default: "mongodb://localhost/fmop"
  },
  {
    type: 'input',
    name: 'baseName',
    message: 'Admin key name',
    default: 'admin'
  },
  {
    type: 'input',
    name: 'baseKey',
    message: 'Admin key (Copy this so you can use it later)',
    default: require('shortid').generate() + require('shortid').generate()
  }
]

inquirer.prompt(questions).then((data) => {
  console.log(data)

  var config = JSON.stringify({
    url: data.url,
    port: data.port,
    mongodb: data.mongodb,
    types: {
      "application/javascript": "js",
      "application/json": "json",
      "application/xml": "xml",
      "application/zip": "zip",
      "application/pdf": "pdf",
      "application/octet-stream": "png",
      "text/plain": "txt",
      "text/html": "html",
      "image/png": "png",
      "image/jpeg": "jpeg",
      "image/gif": "gif"
    },
    baseKey: {
      key: data.baseKey,
      name: data.baseName
    }
  }, null, '\t')

  console.log(config)

  fs.writeFile('./config.json', config, function(err) {
    if (err) throw err;

    console.log('Succesfully written config file!')
    console.log('Youre ready to start fmop now with `npm start`')
  })
})