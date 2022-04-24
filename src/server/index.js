const fs = require('fs')
const http = require('http')
const https = require('https')
const key = fs.readFileSync(__dirname+'/ssl/key.pem')
const cert = fs.readFileSync(__dirname+'/ssl/cert.pem')
const httpPort = 8080
const httpsPort = process.env.NODE_ENV === 'production' ?
	proces.env.PORT || 3000 :
	8443
// HTTP to HTTPS redirect
const httpRedirect = http.createServer((req, res) => {
	res.writeHead(308, {location: 'https://'+req.headers.host+req.url})
	res.end()
})

// bundle HTML-exporting scripts
const brfs = require('brfs')
const toBundle = __dirname+'/../views/export/'
const bundled  = __dirname+'/../views/bundle/'
const filesToBundle = fs.readdirSync(toBundle)
for (filename of filesToBundle) {
	fs.createReadStream(toBundle+filename)
	.pipe(brfs(toBundle+filename))
	.pipe(fs.createWriteStream(bundled+filename))
}

const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));

require('./routes/api')(app)
require('./routes/spa')(app)

const httpsServer = https.createServer({key: key, cert: cert}, app)
httpsServer.listen(httpsPort)
httpRedirect.listen(httpPort)