const fs = require('fs')
const http = require('http')
const https = require('https')
const key = fs.readFileSync(__dirname+'/ssl/key.pem')
const cert = fs.readFileSync(__dirname+'/ssl/cert.pem')
const httpPort = 8080
const httpsPort = 8443
const herokuPort = process.env.PORT || 3000;

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

if (process.env.NODE_ENV === 'production') {
	app.all('*', function(req, res, next) {
		if (req.headers.forwarded.proto !== 'https') {
			res.writeHead(308, {location: 'https://'+req.headers.host+req.url})
			res.end()
		} else {
			next()
		}
	})
	const httpServer = http.createServer(app)
	httpServer.listen(herokuPort)
} else {
	const httpsServer = https.createServer({key: key, cert: cert}, app)// HTTP to HTTPS redirect
	const httpRedirect = http.createServer((req, res) => {
		res.writeHead(308, {location: 'https://'+req.headers.host+req.url})
		res.end()
	})
	httpsServer.listen(httpsPort)
	httpRedirect.listen(httpPort)
}