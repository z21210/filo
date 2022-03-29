const mongoose = require('mongoose')
const mongoUri = 'mongodb://127.0.0.1:27017/filo'
mongoose.connect(mongoUri)

const User = require('../../models/models/user')
const Item = require('../../models/models/item')
const Request = require('../../models/models/request')
const auth = require('../../models/utilities/auth')

module.exports = function (app) {

	app.put('/api/register', function (req, res) {
		auth(req, res, function (req, res) {
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', () => {
				authorise('put:register', function (err) {
					res.writeHead(500)
					res.write(err.toString())
					res.end()
				}, 
				function () {
					user = new User(JSON.parse(buffer))
					user.save(function (err, result) {
						if (err) {
							res.writeHead(400)
							res.write(err.toString())
							res.end()
						} else {
							res.writeHead(204)
							res.end()
						}
					})
				})
			})
		})
	})

	app.get('/api/items', function (req, res) {
		auth(req, res, function() {
			Item.find(function (err, result) {
				if (err) {
					res.writeHead(500)
					res.end()
					return
				}
				items = result.map((item) => { 
					return {
						_id: item._id,
						name: item.name, 
						category: item.category, 
						locationFound: item.locationFound, 
						dateFound: item.dateFound, 
						dateListed: item.dateListed
					}
				})
				res.send(items)
			})
		})
	})

	app.get('/api/item/:itemId', function (req, res) {
		auth(req, res, function (req, res) {
			console.log(Buffer.from(req.headers.authorization.slice(6), 'base64').toString())
			const itemId = req.params.itemId
			Item.find({_id: itemId}, function (err, result) {
				if (err) {
					if (err.reason == 'BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters') {
						res.writeHead(400)
						res.end()
						return
					}
					res.writeHead(500)
					res.end()
				}
				if (result[0] == undefined) {
					res.writeHead(404)
					res.end()
					return
				}
				res.send(result[0])
			})
		})
	})

	app.post('/api/item', function (req, res) {
		auth(req, res, function (req, res) {
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', () => {
				item = new Item(JSON.parse(buffer))
				item.save(function (err, result) {
					if (err) {
						res.writeHead(500)
						res.write(err.toString())
						res.end()
					} else {
						console.log(result)
						res.writeHead(204)
						res.end()
					}
				})
			})
		})
	})

	app.put('/api/request', function (req, res) {
		auth(req, res, function (req, res) {
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', () => {
				request = new Request(JSON.parse(buffer))
				request.save(function (err, result) {
					if (err) {
						res.writeHead(500)
						res.write(err.toString())
						res.end()
					} else {
						console.log(result)
						res.writeHead(204)
						res.end()
					}
				})
			})
		})
	})

	app.get('/api/requests', function (req, res) {
		auth(req, res, function (req, res) {
			Request.find(function (err, result) {
				if (err) {
					res.writeHead(500)
					res.end()
					return
				}
				res.send(result)
			})
		})
	})
	
	app.get('/api/request/:requestId', function (req, res) {
		auth(req, res, function (req, res) {
			const requestId = req.params.requestId
			Request.find({_id: requestId}, function (err, result) {
				if (err) {
					if (err.reason == 'BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters') {
						res.writeHead(400)
						res.end()
						return
					}
					res.writeHead(500)
					res.end()
					return
				}
				res.send(result)
			})
		})
	})

	app.put('/api/review/:requestId', function (req, res) {
		auth(req, res, function (req, res) {
			const requestId = req.params.requestId
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', () => {
				const review = JSON.parse(buffer)
				Request.updateOne({_id: requestId}, { $set: {
					reviewed: true,
					approved: review.approved
				}},
				function (err, result) {
					if (err) {
						res.writeHead(500)
						res.write(err.toString())
						res.end()
						return
					}
					res.writeHead(204)
					res.end()
				})
			})
		})
	})
}