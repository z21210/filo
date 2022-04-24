const mongoose = require('mongoose')
const mongoUri = process.env.NODE_ENV === 'production' ? 
	'mongodb+srv://admin:Jvo483tMKShzcfvRdtiFe54gN7p64KXP@cluster0.cd0vw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' :
	'mongodb://127.0.0.1:27017/filo'
mongoose.connect(mongoUri)

const User = require('../../models/user')
const Item = require('../../models/item')
const Request = require('../../models/request')
const auth = require('../utilities/auth')

module.exports = function (app) {

	app.put('/api/register', function (req, res) {
		auth(req, res, function () {
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', function () {
				try {
					buffer = JSON.parse(buffer)
				} catch (err) {
					res.writeHead(400)
					res.write(err.toString())
					res.end()
					return
				}
				buffer.admin = false
				user = new User(buffer)
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
	app.put('/api/login', function (req, res) {
		auth(req, res, function () {
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', function () {
				User.findOne({username: buffer}, function (err, result) {
					if (err) {
						res.writeHead(500)
						res.end()
						return
					}
					if (result == []) {
						res.writeHead(404)
						res.end()
						return
					}
					res.send(result.admin)
				})
			})
		})
	})
	app.put('/api/account', function (req, res) {
		auth(req, res, function () {
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', function () {
				const auth = Buffer.from(req.headers.authorization.slice(6), 'base64').toString()
				const username = auth.slice(0,auth.indexOf(':'))
				try {
					update = JSON.parse(buffer)
				} catch (err) {
					res.writeHead(400)
					res.write(err.toString())
					res.end()
					return
				}
				User.findOneAndUpdate({username}, update, function (err, result) {
					if (err) {
						res.writeHead(500)
						res.write(err.toString())
						res.end()
						return
					}
					if (result == []) {
						res.writeHead(404)
						res.end()
						return
					}
					res.send()
				})
			})
		})
	})

	app.get('/api/items', function (req, res) {
		auth(req, res, function() {
			Item.find({}, {
				_id: true,
				name: true, 
				category: true, 
				locationFound: true, 
				dateFound: true, 
				dateListed: true
			}, 
			function (err, result) {
				if (err) {
					res.writeHead(500)
					res.end()
					return
				}
				res.send(result)
			})
		})
	})

	app.get('/api/reports', function (req, res) {
		auth(req, res, function() {
			const auth = Buffer.from(req.headers.authorization.slice(6), 'base64').toString()
			const username = auth.slice(0,auth.indexOf(':'))
			User.findOne({username}, function (err, result) {
				if (err) {
					res.writeHead(500)
					res.write(err.toString())
					res.end()
					return
				}
				// get items this user has reported
				const userId = result._id
				Item.find({reportedBy: userId}).lean().exec(function (err, result) {
					if (err) {
						res.writeHead(500)
						res.write(err.toString())
						res.end()
						return
					}
					// get requests for these items (note: below, "requested" means "requested and approved" or "requested and awaiting review", excludes "requested and denied")
					items = result
					const itemIds = items.map(item => (item._id))
					Request.find({
						$and: [
							{itemId: 
								{$in: itemIds}
							},
							{$or: [
								{reviewed: false},
								{reviewed: true, approved: true}
							]}
						]
					}, {_id: false, itemId: true, approved: true, userId: true}).populate({path: 'userId', select: 'username email'}).exec(
					function(err, result) {
						//console.log(result[0].userId)
						const requestedItemIds = new Set(
							result.map(request => 
								request.itemId.toString()
							)
						)
						const approvedItemIds = new Set(
							result.filter((request) => 
								request.approved
							)
							.map(request => 
								request.itemId.toString()
							)
						)
						// status is determined server-side, because the user is not privy to if / how many requests there are
						items.forEach((item, i) => {
							let status
							let contact
							if (requestedItemIds.has(item._id.toString())) {
								if (approvedItemIds.has(item._id.toString())) {
									status = 'request approved'
									contact = result.find((request) => request.itemId.toString() === item._id.toString()).userId
								} else {
									status = 'request awaiting review'
								}
							} else {
								status = 'awaiting request'
							}
							Object.assign(items[i], {status, contact})
						})
						res.send(items)
					})
				})
			})
		})
	})

	app.get('/api/item/:itemId', function (req, res) {
		auth(req, res, function () {
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

	app.delete('/api/item/:itemId', function (req, res) {
		auth(req, res, function () {
			const itemId = req.params.itemId
			//delete all requests for this item
			Request.deleteMany({itemId}, function (err, result) {
				if (err) {
					res.writeHead(500)
					res.end()
					return
				}
				//delete the item
				Item.deleteOne({_id: itemId}, function (err, result) {
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
					res.writeHead(204)
					res.end()
				})
			})
		})
	})

	app.post('/api/item', function (req, res) {
		auth(req, res, function () {
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', () => {
				const auth = Buffer.from(req.headers.authorization.slice(6), 'base64').toString()
				const username = auth.slice(0,auth.indexOf(':'))
				try {
					buffer = JSON.parse(buffer)
				} catch (err) {
					res.writeHead(400)
					res.write(err.toString())
					res.end()
					return
				}
				User.findOne({username}, function (err, result) {
					if (err) {
						res.writeHead(500)
						res.write(err.toString())
						res.end()
					} else {
						buffer.reportedBy = result._id
						item = new Item(buffer)
						item.save(function (err, result) {
							if (err) {
								res.writeHead(500)
								res.write(err.toString())
								res.end()
							} else {
								res.writeHead(204)
								res.end()
							}
						})
					}
				})
			})
		})
	})

	app.put('/api/item/:itemId', function (req, res) {
		auth(req, res, function () {
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', () => {
				try {
					update = JSON.parse(buffer)
				} catch (err) {
					res.writeHead(400)
					res.write(err.toString())
					res.end()
					return
				}
				const itemId = req.params.itemId
				Item.findOneAndUpdate({_id: itemId}, update, function (err, result) {
					if (err) {
						res.writeHead(500)
						res.write(err.toString())
						res.end()
						return
					}
					if (result == []) {
						res.writeHead(404)
						res.end()
						return
					}
					res.send(result)
				})
			})
		})
	})

	app.put('/api/request', function (req, res) {
		auth(req, res, function () {
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', () => {
				const auth = Buffer.from(req.headers.authorization.slice(6), 'base64').toString()
				const username = auth.slice(0,auth.indexOf(':'))
				User.findOne({username}, function (err, result) {
					if (err) {
						res.writeHead(500)
						res.write(err.toString())
						res.end()
					} else {
						try {
							buffer = JSON.parse(buffer)
						} catch (err) {
							res.writeHead(400)
							res.write(err.toString())
							res.end()
							return
						}
						buffer.reviewed = false
						buffer.approved = false
						buffer.userId = result._id
						request = new Request(buffer)
						request.save(function (err, result) {
							if (err) {
								res.writeHead(500)
								if (err.code == 11000) {
									res.write('You have already requested this item')
								} else {
									res.write(err.toString())
								}
								res.end()
							} else {
								res.writeHead(204)
								res.end()
							}
						})
					}
				})
			})
		})
	})

	app.get('/api/requests', function (req, res) {
		auth(req, res, function () {
			const auth = Buffer.from(req.headers.authorization.slice(6), 'base64').toString()
			const username = auth.slice(0,auth.indexOf(':'))
			User.findOne({username}, function (err, result) {
				if (err) {
					res.writeHead(500)
					res.write(err.toString())
					res.end()
					return
				}
				Request.find({userId: result._id}).populate({path:'itemId', populate:{path:'reportedBy', select:'username email'}}).exec(function (err, result) {
					if (err) {
						res.writeHead(500)
						res.write(err.toString())
						res.end()
						return
					}
					result.forEach((request, i) => {
						if (!(request.reviewed && request.approved)) {
							Object.assign(result[i].itemId.reportedBy, {_id: '', username:'', email:''})
						}
					})
					res.send(result)
				})
			})
		})
	})

	app.get('/api/review', function (req, res) {
		auth(req, res, function () {
			Request.find().populate('itemId').populate({path:'userId', select: 'username'}).exec(function (err, result) {
				if (err) {
					res.writeHead(500)
					res.end()
					return
				}
				res.send(result)
			})
		})
	})

	app.put('/api/review/:requestId', function (req, res) {
		auth(req, res, function () {
			const requestId = req.params.requestId
			var buffer = ''
			req.on('data', (data) => buffer = buffer + data)
			req.on('end', () => {
				try {
					review = JSON.parse(buffer)
				} catch (err) {
					res.writeHead(400)
					res.write(err.toString())
					res.end()
					return
				}
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
					res.writeHead(200)
					res.end()
				})
			})
		})
	})
}