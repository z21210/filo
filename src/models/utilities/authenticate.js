const User = require('../models/user')
const crypto = require('crypto')
module.exports = function (headers, error, success) {
	if (headers.authorization === undefined) {
		// user claims to have no account, this is true so passes authentication
		success(undefined)
		return
	} else {
		auth = Buffer.from(headers.authorization.slice(6), 'base64').toString()
	 	username = auth.slice(0,auth.indexOf(':'))
	 	password = auth.slice(auth.indexOf(':')+1)		
	}

	User.find({username}, function (err, result) {
		if (err) { // db error
			error(err)
			return
		}
		if (result.length == 0) { // user not found
			error(new Error(`user ${username} not found`))
			return
		}
		const user = result[0]
		if (user.password === undefined || user.passwordSalt === undefined) {
			error(new Error('User\'s entry is incomplete'))
			return
		}
		const hash = crypto.createHmac('SHA256', Buffer.from(user.passwordSalt, 'hex')).update(password).digest('hex') // check password
		if (user.password == hash) {
			success(username)
			return
		} else {
			error(new Error('Wrong password'))
			return
		}
	})
}