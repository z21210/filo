const authenticate = require('../utilities/authenticate')
const authorise = require('../utilities/authorise')

module.exports = function (req, res, next) {
	authenticate(req.headers, function (err) {
		res.writeHead(401)
		res.write(err.toString())
		res.end()
	}, function (username) {
		authorise(username, 'get:items', function (err) {
			res.writeHead(401)
			res.write(err.toString())
			res.end()
		}, next)
	})
}