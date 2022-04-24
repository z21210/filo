const authenticate = require('./authenticate')
const authorise = require('./authorise')

module.exports = function (req, res, next) {
	// prevent HTTP request smuggling (multiple methods = malicious)
	var methods = req.route.methods // e.g.: { {put: true}, {post: false}, {get: true} }
	for (m in methods) {
		if (!methods[m]) {
			delete methods[m]
		}
	}
	const numberOfMethods = Object.keys(methods).length
	if (numberOfMethods > 1) {
		res.writeHead(400)
		res.write('Error: multiple request methods')
		res.end()
		return
	}

	// determine the attempted action
	const method = Object.keys(req.route.methods)[0]
	const path = req.route.path
	const action = `${method}:${path}`

	// is the user who they claim to be
	authenticate(req.headers, function (err) {
		res.writeHead(401)
		res.write(err.toString())
		res.end()
	}, function (username) {
		// is the account allowed to do this action
		authorise(username, action, function (err) {
			res.writeHead(401)
			res.write(err.toString())
			res.end()
		}, next)
	})
}