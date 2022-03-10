const fs = require('fs')
const browserify = require('browserify')

module.exports = function (app) {
	//landing page = browse.html
	app.get('/', function (req, res) {
		res.set('Content-Type', 'text/html')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/browse.html').pipe(res)
	})
	//favicons
	app.get('/favicon.ico', function (req, res) {
		res.set('Content-Type', 'image/vnd.microsoft.icon')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../../favicon.ico').pipe(res)
	})
	//css
	app.get('/all.css', function (req, res) {
		res.set('Content-Type', 'text/css')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../../styles/all.css').pipe(res)
	})
	//common components
	app.get('/component/header.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/components/header.js').pipe(res)
	})
	app.get('/root.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../controllers/root.js').pipe(res)
	})

	//<---- views ---->
	//account
	app.get('/account', function (req, res) {
		res.set('Content-Type', 'text/html')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/account.html').pipe(res)
	})
	//browse
	app.get('/browse', function (req, res) {
		res.set('Content-Type', 'text/html')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/browse.html').pipe(res)
	})
	//report
	app.get('/report', function (req, res) {
		res.set('Content-Type', 'text/html')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/report.html').pipe(res)
	})
	//reports
	app.get('/reports', function (req, res) {
		res.set('Content-Type', 'text/html')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/reports.html').pipe(res)
	})
	//request
	app.get('/request', function (req, res) {
		res.set('Content-Type', 'text/html')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/request.html').pipe(res)
	})
	//requests
	app.get('/requests', function (req, res) {
		res.set('Content-Type', 'text/html')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/requests.html').pipe(res)
	})
	//review
	app.get('/review', function (req, res) {
		res.set('Content-Type', 'text/html')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/review.html').pipe(res)
	})
	//reviews
	app.get('/reviews', function (req, res) {
		res.set('Content-Type', 'text/html')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/reviews.html').pipe(res)
	})

	//<---- controllers ---->
	app.get('/header.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/header.js').bundle().pipe(res)
	})
	app.get('/account.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/account.js').bundle().pipe(res)
	})
	app.get('/browse.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/browse.js').bundle().pipe(res)
	})
	app.get('/item.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/item.js').bundle().pipe(res)
	})
	app.get('/report.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/report.js').bundle().pipe(res)
	})
	app.get('/reports.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/reports.js').bundle().pipe(res)
	})
	app.get('/request.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/request.js').bundle().pipe(res)
	})
	app.get('/requests.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/requests.js').bundle().pipe(res)
	})
	app.get('/review.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/review.js').bundle().pipe(res)
	})
	app.get('/reviews.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/reviews.js').bundle().pipe(res)
	})
}