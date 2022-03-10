const fs = require('fs')
const http = require('http')
const https = require('https')
const key = fs.readFileSync(__dirname+'/ssl/key.pem')
const cert = fs.readFileSync(__dirname+'/ssl/cert.pem')
const httpPort = 8080
const httpsPort = 8443
const httpRedirect = http.createServer((req, res) => {
	res.writeHead(308, {location: 'https://'+req.headers.host+req.url})
	res.end()
})

const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose')
const mongoUri = 'mongodb://127.0.0.1:27017/filo'
var db = mongoose.connection
//db.on
mongoose.connect(mongoUri)

require('../models/routes/http')(app)
require('../models/routes/api')(app)

const httpsServer = https.createServer({key: key, cert: cert}, app)
httpsServer.listen(8443)