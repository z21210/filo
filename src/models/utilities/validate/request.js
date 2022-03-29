const User = require('../../models/user')
const Item = require('../../models/item')

module.exports = function (request, success, error) {
	if (request.itemId === undefined || request.userId === undefined) {
		error(new Error('request is incomplete'))
		return
	}
	User.find({_id: request.userId}, function (err, result) {
		if (err) {
			error(err)
			return
		}
		if (result[0] === undefined) {
			error(new Error(`user of userId ${request.userId} not found`))
			return
		}
		Item.find({_id: request.itemId}, function (err, result) {
			if (err) {
				error(err)
				return
			}
			if (result[0] === undefined) {
				error(new Error(`item of itemId ${request.itemId} not found`))
				return
			}
			success()
		})
	})
}