const fs = require('fs')
const browserify = require('browserify')

module.exports = function (app) {
	// landing page
	app.get('/', function (req, res) {
		res.set('Content-Type', 'text/html')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../views/root.html').pipe(res)
	})
	app.get('/root.js', function (req, res) {
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		browserify(__dirname+'/../../controllers/root.js').bundle().pipe(res)
	})
	// favicons
	app.get('/favicon.ico', function (req, res) {
		res.set('Content-Type', 'image/vnd.microsoft.icon')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../../favicon.ico').pipe(res)
	})
	// css
	app.get('/all.css', function (req, res) {
		res.set('Content-Type', 'text/css')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../../styles/all.css').pipe(res)
	})
	// angularjs
	app.get('/angular.js', function (req, res) {
		res.set()
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../../node_modules/angular/angular.min.js').pipe(res)
	})
	app.get('/angular.min.js.map', function (req, res) {
		res.set()
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../../node_modules/angular/angular.min.js.map').pipe(res)
	})
	// ui-router
	app.get('/ui-router.js', function (req, res) {
		res.set()
		res.set('Content-Type', 'application/javascript')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../../node_modules/@uirouter/angularjs/release/angular-ui-router.min.js').pipe(res)
	})
	app.get('/angular-ui-router.min.js.map', function (req, res) {
		res.set()
		res.set('Content-Type', 'application/json')
		res.writeHead(200)
		fs.createReadStream(__dirname+'/../../../node_modules/@uirouter/angularjs/release/angular-ui-router.min.js.map').pipe(res)
	})
}