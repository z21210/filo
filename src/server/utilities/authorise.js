/*
authorise
	verb
		to grant authorisation or clearance for
"Is this user allowed to do this action?"
*/

const User = require('../../models/user')

module.exports = function (username, action, error, success) {
	User.find({username}, function (err, result) {
		if (err) { // db error
			error(err)
		}
		if (username !== undefined && result.length == 0) { // user not found
			error(new Error(`user '${username}' not found`))
		}
		if (username === undefined) {
			user = undefined
		} else {
			user = result[0]
		}
		switch (action) {
			// admin actions
			case 'get:/api/review':
			case 'put:/api/review/:requestId':
			case 'put:/api/item/:itemId':
			case 'delete:/api/item/:itemId':
				if (user !== undefined) {
					if (user.admin) {
						success()
						return
					} else {
						error(new Error(`user '${username}' cannot perform action '${action}'`))
						return
					}
				} else {
					if (username !== undefined) {
						error(new Error(`user '${username}' not found`))
						return
					} else {
						error(new Error(`must be logged in to perform action '${action}'`))
						return
					}
				}
			// user actions
			case 'get:/api/item/:itemId':
			case 'post:/api/item':
			case 'get:/api/reports':
			case 'put:/api/request':
			case 'get:/api/requests':
			case 'get:/api/request/:requestId':
			case 'put:/api/account':
				if (user !== undefined) {
					success()
					return
				} else {
					if (username !== undefined) {
						error(new Error(`user '${username}' not found`))
						return
					} else {
						error(new Error(`must be logged in to perform action '${action}'`))
						return
					}
				}
			// non-user actions
			case 'put:/api/login':
			case 'put:/api/register':
			case 'get:/api/items':
				success()
				return
			// unrecognised action
			default:
				error(new Error(`action '${action}' unrecognised`))
				return
		}
		
	})
}