var config = require('./config.json')

var shortid = require('shortid');
var express = require('express')
var helmet = require('helmet')
var multer  = require('multer')
var expressValidator = require('express-validator')
var app = express()

var fs = require('fs')
var path = require('path')

var mongoose = require('mongoose')
mongoose.connect(config.mongodb)

fileModel = require('./models/file.js')
keyModel = require('./models/key.js')

if (config.baseKey) {
  keyModel.findOne(config.baseKey, function(err, key) {
    if (key) return;

    keyModel.create(config.baseKey, function(err, key) {
      if (err) throw err;

      console.log('Created base key for ' + config.baseKey.name)
    }) 
  })
}

app.use(helmet())

app.use(expressValidator())

var upload = multer().single('file')
app.use('/f', express.static('./uploads'))

app.get('/', function(req, res) {
  res.send('Hello, I\'m fmop!')
})

app.post('/upload', upload, function(req, res) {
  /**
  res.json({
    status: 200,
    data: {
      name: shortid.generate() + mime.get(req.file.mimetype)
    }
  })
   */

  req.checkBody('key', 'No key given').notEmpty().matches(/[a-zA-Z0-9_-]+/)

  req.getValidationResult().then(function(result) {

    if (!result.isEmpty()) {

      console.log(result.array());

      return res.status(400).json({
        status: 400,
        error: 'No key given'
      })

    } else if (!req.file) {

      return res.status(400).json({
        status: 400,
        error: 'No file given'
      })

    } else {

      keyModel.findOne({ key: req.body.key }, (err, key) => {
        if (err || !key) {
          return res.status(403).json({
            status: 403,
            error: 'Not authorized to upload with the given key'
          })
        }

        var id = shortid.generate()
        var name

        if (req.file.originalname) {
          var ext = path.extname(req.file.originalname)
          name = id + ext
        } else {
          name = id
        }

        fileModel.create({
          name: name,
          fileId: id,
          uploader: key.name,
          mimetype: req.file.mimetype,
          location: './uploads/' + name
        }, function(err, file) {
          if (err) {
            return res.status(500).json({
              status: 500,
              error: 'Something went wrong with indexing the file'
            })
          }

          fs.writeFile('./uploads/' + name, req.file.buffer, function(err) {
            if (err) {
              file.remove(function(err) {
                return res.status(500).json({
                  status: 500,
                  error: 'Something went wrong when uploading'
                })
              })
            }

            res.json({
              status: 200,
              data: {
                name: name,
                id: id,
                uploader: key.name,
                location: './uploads/' + name,
                link: config.url + '/f/' + name
              }
            })
          })
        })

      })
    }
  })
  
})

app.listen(config.port, function() {
  console.log('fmop is running on port ' + config.port + '!')
})