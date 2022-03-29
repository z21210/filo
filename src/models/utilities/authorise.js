const User = require('../models/user')

module.exports = function (username, action, error, success) {
	User.find({username}, function (err, result) {
		if (err) { // db error
			error(err)
		}
		if (username !== undefined && result.length == 0) { // user not found
			error(new Error(`user ${username} not found`))
		}
		if (username === undefined) {
			user = undefined
		} else {
			user = result[0]
		}
		switch (action) {
			// admin actions
			case 'get:requests':
			case 'get:request':
			case 'put:review':
				if (user !== undefined) {
					if (user.admin) {
						success()
						return
					} else {
						error(new Error(`user ${username} cannot perform action ${action}`))
						return
					}
				} else {
					if (username !== undefined) {
						error(new Error(`user ${username} not found`))
						return
					} else {
						error(new Error(`must be logged in to perform action ${action}`))
						return
					}
				}
			// user actions
			case 'get:item':
			case 'post:item':
			case 'put:request':
				if (user !== undefined) {
					success()
					return
				} else {
					if (username !== undefined) {
						error(new Error(`user ${username} not found`))
						return
					} else {
						error(new Error(`must be logged in to perform action ${action}`))
						return
					}
				}
			// non-user actions
			case 'pet:register':
			case 'get:items':
				success()
				return
			// unrecognised action
			default:
				error(new Error(`action ${action} unrecognised`))
				return
		}
		
	})
}